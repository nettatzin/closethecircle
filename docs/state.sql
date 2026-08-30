-- ============================================================================
-- state.sql — Close the Circle / EXAI (qjqqyvpqkbljngmhxahl)
--
-- WHY THIS FILE EXISTS
-- Docs contain zero state. Any row count written into prose is wrong within
-- weeks — that is what caused the July→August documentation drift. Run these
-- instead of trusting a number in a markdown file.
--
-- Every query is READ-ONLY. Run via Supabase MCP execute_sql or the SQL editor.
-- All queries verified against live EXAI on 2026-08-30.
--
-- SESSION START: run Q1, Q2, Q3. Then read decisions.md. Then work.
-- ============================================================================


-- ============================================================
-- Q1. What exists
-- ============================================================
select table_name, table_type
from information_schema.tables
where table_schema = 'public'
order by table_type, table_name;


-- ============================================================
-- Q2. Row counts and classification coverage
-- NEVER use list_tables statistics — Postgres reltuples is stale and has
-- reported 0 for fully populated tables.
-- ============================================================
select 'global_initiatives' as t,
       count(*)                                            as total,
       count(*) filter (where is_verified_active is true)   as verified,
       count(*) filter (where is_verified_active is null)   as unflagged,
       count(*) filter (where relevance_score is null)      as unclassified
from global_initiatives
union all
select 'facebook_communities',
       count(*),
       count(*) filter (where is_verified_active is true),
       count(*) filter (where is_verified_active is null),
       count(*) filter (where relevance_score is null)
from facebook_communities
union all
select 'v_activities (visitor-visible)', count(*), null, null, null from v_activities
union all
select 'financial_benefits', count(*), null, null, null from financial_benefits
union all
select 'artworks',  count(*), null, null, null from artworks
union all
select 'artists',   count(*), null, null, null from artists
union all
select 'tags',      count(*), null, null, null from tags
union all
select 'sources',   count(*), null, null, null from sources;

-- Any gap between base-table counts and v_activities is the D1 filter:
--   is_verified_active = true AND relevance_score IS NOT NULL


-- ============================================================
-- Q3. Does the view match contracts.md §2?
-- Compare this column list against the contract before any app change.
-- Watch for: region, energy_level (S-117 — currently absent)
-- ============================================================
select string_agg(column_name, ' · ' order by ordinal_position) as v_activities_columns
from information_schema.columns
where table_schema = 'public' and table_name = 'v_activities';

-- Full view definition including WHERE clauses:
select pg_get_viewdef('public.v_activities'::regclass, true) as def;


-- ============================================================
-- Q4. Security posture — S-116
-- reloptions MUST contain security_invoker=true, or the view bypasses RLS
-- on the base tables entirely.
-- ============================================================
select c.relname,
       c.relkind,
       pg_get_userbyid(c.relowner) as owner,
       c.reloptions,
       (select string_agg(g.grantee || ':' || g.privilege_type, ', ')
          from information_schema.role_table_grants g
         where g.table_name = c.relname
           and g.table_schema = 'public'
           and g.grantee in ('anon','authenticated')) as anon_grants
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind in ('v','r')
order by c.relkind desc, c.relname;

-- Policies:
select tablename, policyname, cmd, roles::text, qual
from pg_policies where schemaname = 'public'
order by tablename, policyname;

-- Auto-updatable views are a write path if anon holds INSERT/UPDATE grants:
select table_name, is_updatable, is_insertable_into
from information_schema.views where table_schema = 'public';


-- ============================================================
-- Q5. Artwork layer completeness — gates V2 matching (S-122, S-123)
-- Target: every artwork with all five principles, zero curator_review
-- ============================================================
select a.slug,
       a.title_en,
       count(t.*)                                                    as total_tags,
       count(t.*) filter (where t.dimension = 'exhibition_principle') as principle_tags,
       count(t.*) filter (where t.status = 'validated')               as validated,
       count(t.*) filter (where t.status = 'curator_review')          as awaiting_review
from artworks a
left join tags t on t.artwork_id = a.id
group by a.id, a.slug, a.title_en
order by a.slug;

-- What is stuck awaiting curator review:
select a.slug, t.dimension, t.value, t.cluster_type, t.match_score
from tags t join artworks a on a.id = t.artwork_id
where t.status = 'curator_review'
order by a.slug, t.dimension;


-- ============================================================
-- Q6. Hebrew coverage — S-71
-- Hebrew columns EXIST on artists, artworks and financial_benefits.
-- They do NOT exist on the two initiative tables, which is where the
-- visitor-facing content lives. That is the gap.
-- ============================================================
select table_name, string_agg(column_name, ', ' order by column_name) as he_columns
from information_schema.columns
where table_schema = 'public'
  and (column_name like '%\_he' escape '\' or column_name like '%\_he\_%' escape '\')
group by table_name
order by table_name;

-- Hebrew-native vs English split — RECOUNT before the translation run.
-- Hebrew-native rows must never be round-tripped through English.
select 'global_initiatives' as t,
       count(*) filter (where name ~ '[א-ת]') as hebrew_native,
       count(*) filter (where name !~ '[א-ת]') as english
from global_initiatives
union all
select 'facebook_communities',
       count(*) filter (where name ~ '[א-ת]'),
       count(*) filter (where name !~ '[א-ת]')
from facebook_communities;


-- ============================================================
-- Q7. Tag vocabulary shape — inputs to IDF weighting (D15, S-122)
-- The head-heavy distribution is what makes the family graph tractable.
-- ============================================================
with act as (
  select 'materials' d, unnest(materials)            v, id from v_activities
  union all select 'process',   unnest(process),            id from v_activities
  union all select 'community', unnest(community_archetype), id from v_activities
  union all select 'impact',    unnest(impact_tags),        id from v_activities
), ranked as (
  select d, v,
         count(distinct id) n,
         row_number() over (partition by d order by count(distinct id) desc) rk,
         sum(count(distinct id)) over (partition by d) total
  from act group by d, v
)
select d,
       max(total)                                                    as tag_instances,
       count(*)                                                      as distinct_values,
       round(100.0 * sum(n) filter (where rk <= 15) / max(total), 0) as pct_in_top15,
       round(100.0 * sum(n) filter (where rk <= 30) / max(total), 0) as pct_in_top30,
       count(*) filter (where n = 1)                                 as singletons
from ranked group by d order by d;

-- High-frequency values needing IDF downweighting.
-- Anything matching a large share of the catalogue carries almost no signal.
with act as (
  select 'materials' d, unnest(materials)            v, id from v_activities
  union all select 'process',   unnest(process),            id from v_activities
  union all select 'community', unnest(community_archetype), id from v_activities
  union all select 'impact',    unnest(impact_tags),        id from v_activities
)
select d, v, count(distinct id) n,
       round(100.0 * count(distinct id) / (select count(*) from v_activities), 0) as pct_of_catalogue
from act group by d, v
having count(distinct id) > (select count(*) * 0.4 from v_activities)
order by n desc;


-- ============================================================
-- Q8. Storage — D16, S-121
-- ============================================================
select id, name, public, created_at from storage.buckets;
select count(*) as objects from storage.objects;

-- Artworks still pointing at external hotlinks:
select slug, media_refs from artworks
where media_refs::text ilike '%http%'
order by slug;


-- ============================================================
-- Q9. Filter distributions — informs D18 (ordering) and S-127 (bucketing)
-- Watch for buckets that would return almost nothing.
-- ============================================================
select 'effort' as dim, effort as value, count(*),
       round(100.0 * count(*) / sum(count(*)) over (), 0) as pct
from v_activities group by 2
union all
select 'format', format, count(*), round(100.0 * count(*) / sum(count(*)) over (), 0)
from v_activities group by 2
union all
select 'activity_kind', activity_kind, count(*), round(100.0 * count(*) / sum(count(*)) over (), 0)
from v_activities group by 2
order by 1, 3 desc;

-- The proposed effort → energy_level bucketing, with resulting balance.
-- A bucket under ~10% means that filter option looks broken to visitors.
select case when effort in ('less_than_a_minute','up_to_10_minutes') then 'low_key'
            when effort = '1_hour'    then 'hands_on'
            when effort = 'dedicated' then 'deep_work'
            else 'UNMAPPED' end as energy_level,
       count(*),
       round(100.0 * count(*) / sum(count(*)) over (), 0) as pct
from v_activities group by 1 order by 2 desc;

-- location values feeding the region derivation — unnormalized, check before
-- trusting ILIKE 'israel%'
select location, count(*) from v_activities group by 1 order by 2 desc limit 20;

-- draws coverage (the one filter dimension that is fully backfilled)
select unnest(draws) as draw, count(*) from v_activities group by 1 order by 2 desc;
