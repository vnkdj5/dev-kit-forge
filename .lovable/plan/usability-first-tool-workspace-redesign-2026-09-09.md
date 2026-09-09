# Usability-first tool workspace redesign

## Goal
Make every utility faster and more comfortable to use, with large paste/result areas as the dominant part of the screen. Follow the selected **Pro Editor Split** direction using the locked Workbench Dark palette, Space Grotesk headings, DM Sans interface text, and monospaced editor content.

## Changes

1. **Create a reusable tool workspace**
   - Add a shared full-height shell with a compact title bar, tool description, mode controls, primary action, and status row.
   - Add reusable input/output panes with clear labels and pane-level actions such as Paste, Clear, Copy, and Download where relevant.
   - Keep controls visible without reducing the editing area.

2. **Maximize working space**
   - Remove the permanent history column from tool pages and keep history available through the existing navigation/history page.
   - Reduce outer spacing and make the workspace fill the available viewport below the app header.
   - Give text areas a substantial minimum height and let them grow to fill the screen.
   - Use side-by-side panes on desktop and a comfortable stacked layout on smaller screens.

3. **Apply the workspace consistently**
   - Redesign Base64 Encoder/Decoder and URL Encoder/Decoder around large input and output panes.
   - Redesign JSON Formatter and Text to JSON with the same pane structure while preserving validation, format/minify, and prettify behavior.
   - Redesign HTML Viewer & Editor so the editor and live preview fill the workspace.
   - Restyle the Decimal/Binary converter within the same compact shell while preserving its specialized 64-bit bit grid and interactions.

4. **Improve interaction clarity**
   - Use a clear segmented mode selector where a tool has multiple modes.
   - Place the primary process action in the top toolbar and keep copy/clear actions beside the pane they affect.
   - Add accessible labels, keyboard focus states, disabled states where actions have no content, and clear success/error feedback.
   - Preserve history recording and all current conversion logic.

5. **Align the visual system**
   - Update semantic theme tokens to the chosen Workbench Dark colors and set the chosen typography globally.
   - Keep borders, focus rings, editor surfaces, and status colors consistent across all tools.
   - Avoid decorative cards inside the workspace so the editors remain visually and physically dominant.

6. **Verify usability**
   - Check Base64, URL, JSON, Text-to-JSON, HTML preview, and decimal/binary interactions.
   - Verify desktop and mobile layouts for readable controls, large editing areas, no overlap, and usable scrolling.

## Technical details
- Build the shared workspace as small reusable React components rather than duplicating layout across tools.
- Use existing design-system buttons and semantic color tokens.
- Keep the existing routes, modular tool registry, history storage, and tool behavior unchanged.
