# Hide artwork and cashback surfaces

## Changes
- Remove Artworks and Cash back from the visible desktop and mobile navigation.
- Remove the artwork preference tile from Act.
- Stop artwork selections from affecting Act results or its preference summary.
- Keep all existing screens, data, strings, and saved artwork functionality in the code so they can be restored later.
- Preserve the remaining English and Hebrew navigation and filtering behavior.

## Technical details
- Narrow the visible navigation configuration without deleting supported modes.
- Remove artwork-specific rendering and filtering from the Act screen while retaining its existing external state contract.
- Verify the preview builds and the remaining navigation/filter layout renders correctly on mobile and desktop.
