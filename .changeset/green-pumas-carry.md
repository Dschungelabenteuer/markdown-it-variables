---
'markdown-it-variables': major
---

- Added new `ucfirst` modifier that capitalizes the first letter of a variable, aliased as `^`.
- A distinction is now made between simple and rich modifiers where rich modifiers can only be applied to rich variables and simple modifiers can be applied to both simple and rich variables.

#### Breaking changes

Because of the new distinction between simple and rich modifiers, modifiers can now be applied to simple variables as long as they're not rich modifiers. Previously, it would throw with `UnexpectedModifierError`, it now only throws with `UnexpectedRichModifierError` when a rich modifier is applied to a simple variable.
