# Beta Test Plan

## **1. Core Functionalities for Beta Version**

Below are the essential features that must be available for beta testing, along with any changes made since the initial Tech3 Action Plan.

| **Feature Name** | **Description** | **Priority (High/Medium/Low)** | **Changes Since Tech3** |
| --- | --- | --- | --- |
| Community | Access the TCG created by the user and the TCGM community. The creator of a game should be able to choose the privacy level of its creation. | High | Added an info page for each game.
Added privacy setting for games.
 |
| Card Editor | Create, edit, and manage cards with custom stats and visuals. | High | Added full card creation and edition. With customiable attributes and design |
| Board Editor | Customize game board layout (zones, rows, etc.). | High | Full board customization, adding custom zones wuth images and shapes with simmetry for 1v1 gameplay. |
| Card Layout Editor | Define card types and behaviors (e.g., spells, creatures). | High | Card layout customization linked to each individual card type in a game. This layout will be applied to each card of the chosen card type. |
| Templates | Pre-configured templates for faster game creation. | High | Pre-configured game configurations for card types, effects and rules so the user can create and play quickly. |
| Play Mode Manual | Multiplayer testing of games. where every action is made by the player. | High | Added multiplayer lobby’s creation and joining.
Added ability to launch game and move card from zone to zone.
Added ability to put counters on cards |
| User Manual | Documentation on engine usage and feature explanations. | Medium | Detailed user manual to create a new game from scratch and play it on manual mode. |
| Rules Editor | Define game rules and win conditions through a scripting and logic interface. | Low | Ability to customize gameplay actions and rules which will be applied in game. |
| Play Mode Automatic | Multiplayer testing of games. Rules are applied automatically by the server using the game from the user. | Low | Card effect automation and game mechanics handled automatically in game without needing specific user manipulations. |

---

## **2. Beta Testing Scenarios**

### **2.1 User Roles**

| **Role Name** | **Description** |
| --- | --- |
| Player | Play with others users with a chosen TCG open to public. |
| Designer | Access to card/rule/type editors and play mode to design and test new TCGs.
Can choose to set the TCG to public or private. |

### **2.2 Test Scenarios**

### **Scenario 1: Card creation in Card Editor**

- **Role Involved:** Designer
- **Objective:** Ensure card creation process works as expected.
- **Preconditions:** User account is logged in.
- **Test Steps:**
    1. Select TCG to edit.
    2. Open Card Editor.
    3. Click "Create New Card".
    4. Fill in all required fields (name, type, image, stats).
    5. Save the card.
    6. Search for and edit the newly created card.
- **Expected Outcome:** Card is saved correctly, appears in card list, and is editable without issues.

### **Scenario 2: Rule definition in Rules Editor**

- **Role Involved:** Designer
- **Objective:** Validate the rule definition process.
- **Preconditions:** Existing card and type set.
- **Test Steps:**
    1. Open Rules Editor.
    2. Define a win condition.
    3. Link rules to card behaviors (e.g., when played, when destroyed).
    4. Save and apply rule set to a deck.
    5. Test deck in Play Mode.
- **Expected Outcome:** Rules behave correctly in simulation; no crashes or unexpected results.

### **Scenario 3: Multiplayer lobby**

- **Role Involved:** Player
- **Objective:** Confirm multiplayer mode is functional and stable.
- **Preconditions:** Two users with decks ready.
- **Test Steps:**
    1. Select TCG to play.
    2. Join/create lobby.
    3. Load selected deck.
    4. Launch game from lobby.
    5. Complete a match session.
- **Expected Outcome:** Players connect without issues, game state is synchronized, and match ends correctly.

### **Scenario 4: Set TCG privacy**

- **Role Involved:** Designer
- **Objective:** Ensure the privacy set by the designer of a TCG.
- **Preconditions:** Existing TCG.
- **Test Steps:**
    1. Select TCG to edit.
    2. Set TCG to public or private.
- **Expected Outcome:** Other players cannot see a TCG set private. The designer of a private game can invite other players to join him with a link.

### **Scenario 5: Board Template creation**

- **Role Involved:** Designer
- **Objective:** Allow the creation of TCG board template with already defined shapes.
- **Preconditions:** Existing TCG.
- **Test Steps:**
    1. Select TCG to edit.
    2. Open Board Editor.
    3. Create board of the TCG.
    4. Save the board as template
    5. Set the template to public or private
- **Expected Outcome:** All users can see a public template, but only the creator can see a private template.

### Scenario 6 : Card Layout Creation in Card Layout Editor

- **Role Involved:** Designer
- **Objective:** Allow the creation of custom TCG Card layout.
- **Preconditions:** Existing TCG.
- **Test Steps:**
    1. Select TCG to edit.
    2. Open Card Layout Editor.
    3. Create a custom card Layout (example: round cards).
    4. Save the Card Layout.
    5. Access Card Editor
    6. See card layout inside Card Editor.
- **Expected Outcome:** Card Layout is saved correctly, and we can use it inside the Card Editor.

---

## **3. Success Criteria**

- **Functionality:** All high priority core features (card editor, play mode manual, card layout editor …) function without critical errors.
- **Stability:** < 5% crash rate or critical bugs reported across sessions.
- **Usability:** With the help of the user manual the app is easy to navigate and use.
- **Engagement:** At least 5% of invited testers complete 3+ sessions (creation or play).
- **Feedback Quality:** At least 5 actionable pieces of feedback collected per core feature.

---

## **4. Known Issues & Limitations**

| **Issue** | **Description** | **Impact** | **Planned Fix? (Yes/No)** |
| --- | --- | --- | --- |
| Rule Editor Complexity | Making a rule editor is very complex and hard to envision in it’s whole. | High | Yes |
| App Design (UX/UI) | No one in the team is well versed in design and it is hard to make a visually pleasing design | High | Yes |
| Server Limitations | Having multiple people, playing, editing cards, editing game. We might have problem in scalability | High | No |

---

## **5. Conclusion**

This Beta Test Plan is a crucial step in ensuring that our web-based Trading Card Game engine is robust, user-friendly, and ready for broader use. Through the collaborative efforts of our internal team and external testers, we aim to validate core functionality, uncover edge cases, and refine the user experience. Feedback gathered during this beta will directly inform our development roadmap, prioritize fixes, and shape the features of our official launch.