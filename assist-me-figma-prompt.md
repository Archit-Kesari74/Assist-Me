# ASSIST ME — MASTER FIGMA BUILD PROMPT

Design and prototype a polished, hackathon-winning mobile-first web app called **Assist Me**.

## CORE IDEA

Assist Me is designed for elderly people who may live alone while their children live far away.

The elderly person should NOT have to browse products, type, search, compare options, or understand complicated interfaces.

They simply:

**SPEAK → FAMILY APPROVES → HELPER DELIVERS**

Example:

An elderly user opens Assist Me and sees one enormous microphone.

They say:

> “I need some milk and my blood pressure medicine.”

Assist Me converts the speech into a simple request.

Their child receives the request and can:

**APPROVE** or **REJECT**

If approved, the request becomes a task for a trusted helper.

The helper fulfills it and marks it complete.

The elderly person receives a simple confirmation.

The entire experience should feel like having a helpful human assistant rather than using an e-commerce application.

---

# DESIGN PHILOSOPHY

The target user may be 65–90+ years old.

Assume:

* poor eyesight
* limited technology experience
* difficulty typing
* difficulty navigating menus
* possible hearing difficulties
* possible hand tremors
* cognitive overload from too many choices
* fear of making mistakes

Therefore:

## EXTREME SIMPLICITY

Every screen should have:

* one primary action
* enormous buttons
* very large text
* high contrast
* generous spacing
* obvious labels
* minimal navigation
* no unnecessary cards
* no complicated menus
* no tiny icons without labels
* no hidden gestures
* no crowded dashboards

Use icons WITH text.

Never make an elderly user guess what an icon means.

---

# VISUAL IDENTITY

Brand:

**Assist Me**

Tagline:

**“Just ask. We’ll help.”**

Visual personality:

* warm
* trustworthy
* calm
* human
* accessible
* reassuring
* modern but NOT futuristic
* premium but NOT complicated

Avoid making it look like a typical startup dashboard.

Avoid excessive gradients, glassmorphism, tiny text, complex charts, excessive animations, or dense UI.

## COLOR SYSTEM

Primary:

Deep accessible blue — #1E5EFF

Secondary:

Soft sky blue — #EAF2FF

Success:

#18864B

Error:

#C62828

Warning:

#A65E00

Background:

#FAFBFD

Main text:

#172033

Secondary text:

#536078

White:

#FFFFFF

Use color primarily for meaning and hierarchy, not decoration.

Ensure WCAG-friendly contrast.

---

# TYPOGRAPHY

Use a highly readable sans-serif such as:

Inter, Atkinson Hyperlegible, or similar accessible typeface.

Minimum body text:

18px.

Prefer:

20–22px body text.

Primary headings:

32–40px.

Important actions:

22–26px.

Never use tiny text.

Buttons should have short, explicit labels.

Examples:

“Speak”

“Send Request”

“Approve”

“Reject”

“I'm Done”

“Call My Child”

---

# RESPONSIVE STRUCTURE

Create a responsive experience for:

1. Mobile elderly-user interface
2. Mobile family-member interface
3. Mobile helper interface
4. Desktop/tablet family dashboard

The elderly interface should remain incredibly simple even on desktop.

---

# USER ROLES

Create three roles:

## 1. ELDERLY USER

Can:

* speak a request
* review what Assist Me understood
* send the request
* see request status
* hear/read confirmation
* call family
* optionally see previous requests

## 2. FAMILY MEMBER

Can:

* receive parent requests
* view the request
* see what was requested
* see an estimated cost
* approve
* reject
* ask parent for clarification
* see fulfillment status
* receive completion confirmation

## 3. HELPER

Can:

* see approved tasks
* accept a task
* see what is needed
* see delivery location
* mark task as picked up
* mark task as delivered
* optionally upload proof/photo
* contact family if something goes wrong

---

# ELDERLY USER — HOME SCREEN

This is the MOST IMPORTANT screen.

Make it almost ridiculously simple.

Top:

**Good morning, Mary**

Below:

**What do you need help with?**

Center of the screen:

A HUGE circular microphone button.

Inside:

🎙️

Text underneath:

**Tap to Speak**

Below it:

**You can say things like:**

“I need groceries.”

“I need my medicine.”

“I need someone to fix my fan.”

“I need a ride to the doctor.”

Do not display too many examples.

At the bottom:

Large button:

**Call My Child**

Small status area:

**You have no active requests**

Navigation should be extremely minimal.

Possibly only:

**Home | Requests | Help**

But prioritize Home.

---

# VOICE INTERACTION

When microphone is tapped:

Show a calm listening screen.

Large microphone animation.

Text:

**I'm listening...**

Then:

**Tell me what you need.**

Example:

“I need 2 packets of milk and bread.”

Display live transcription in huge text.

After speech stops:

Show:

**Did I understand you correctly?**

> “You need 2 packets of milk and bread.”

Two huge buttons:

**YES, SEND IT**

**NO, TRY AGAIN**

Do NOT automatically send important requests without confirmation.

---

# SMART REQUEST INTERPRETATION

The prototype should demonstrate that Assist Me converts natural speech into structured information.

Example:

Voice input:

> “Can someone get me milk, bread and my usual biscuits?”

Assist Me displays:

### Your request

🥛 Milk
🍞 Bread
🍪 Biscuits

Estimated total:

**₹250–₹350**

Then:

**Send to my child**

This makes the AI feel useful without overwhelming the elderly user.

---

# REQUEST CONFIRMATION

After sending:

Large success icon.

Heading:

**Request sent!**

Text:

**Your child has been notified.**

Then:

**We'll let you know when they respond.**

Button:

**Back Home**

Optional secondary button:

**Call My Child**

---

# ELDERLY REQUEST STATUS

Create an extremely simple status screen.

Example:

### Your request

**Milk, bread and biscuits**

Status:

🟡 **Waiting for your child**

Timeline:

**Request sent**

↓

**Child reviewing**

↓

**Helper delivers**

Use very large typography.

Avoid complex tracking maps.

---

# APPROVAL SCREEN — FAMILY MEMBER

The family member receives:

**Mom needs your help**

Request card:

### Grocery request

Milk
Bread
Biscuits

Estimated cost:

**₹300**

Location:

**Home**

Time:

**Just now**

Two huge buttons:

🟢 **Approve**

🔴 **Reject**

Below:

**Ask Mom**

Do not bury approve/reject.

---

# FAMILY MEMBER SMART APPROVAL

When the family member taps Approve:

Show:

### Approve request?

**Milk, bread and biscuits**

Estimated cost:

**₹300**

Payment:

**Family payment / Pay helper**

Buttons:

**Approve & Find Helper**

**Cancel**

Then show:

### Request approved

**Finding a trusted helper nearby...**

This should visually communicate that the family is in control.

---

# FAMILY SAFETY FEATURES

Add subtle but important trust features.

For example:

**Family approved**

**Helper verified**

**Delivery confirmed**

Create a small trust section:

### Safety

✓ Approved by family
✓ Helper verified
✓ Delivery tracked
✓ Family notified

Do not make this intimidating.

---

# HELPER SCREEN

Create a very simple helper dashboard.

Header:

**Available Tasks**

Task card:

### Grocery pickup

**Milk + Bread + Biscuits**

Approx. value:

₹300

Distance:

**1.2 km**

Approved by:

**Mary's daughter**

Button:

**Accept Task**

After accepting:

### Your task

**Pick up groceries**

Then:

**I'm on my way**

Then:

**I've picked it up**

Then:

**I've delivered it**

Keep the helper workflow linear.

---

# DELIVERY CONFIRMATION

After helper marks delivered:

Show:

### Delivered!

**Your request has been completed.**

Optional:

**Photo confirmation received**

Then notify family:

**Mom's groceries were delivered.**

Notify elderly user:

**Your groceries have arrived.**

Use plain language.

---

# CRITICAL FEATURE: CLARIFICATION LOOP

Design one special scenario that demonstrates real problem solving.

Example:

Elderly user says:

> “I need my medicine.”

The AI detects that this is ambiguous.

Instead of sending immediately:

### I want to make sure.

**Which medicine do you mean?**

Large choices:

**My usual medicine**

**Something else**

**Call My Child**

This prevents dangerous assumptions.

For sensitive requests, the system should never pretend certainty.

---

# CRITICAL FEATURE: EMERGENCY / URGENT HELP

Add a clearly separated button:

**I NEED URGENT HELP**

Do NOT make it look like a normal shopping request.

When tapped:

### Are you in immediate danger?

Buttons:

**YES — CALL FOR HELP**

**NO — I JUST NEED SOMETHING URGENT**

The prototype can demonstrate escalation to family/emergency assistance without pretending Assist Me itself is an emergency service.

The normal user flow must remain focused on everyday assistance.

---

# CRITICAL FEATURE: SPEAK BACK TO USER

Because some elderly users may struggle to read screens, design an accessibility option:

**🔊 Read this to me**

Whenever important information appears, the user can tap it and Assist Me reads it aloud.

Include a persistent accessibility control:

**🔊 Read aloud**

Also allow:

**Text size: Large**

**Text size: Extra Large**

---

# CRITICAL FEATURE: FAMILY VOICE MESSAGE

When rejecting a request, do not force the child to type.

Example:

Child taps Reject.

Show:

**Why?**

Buttons:

**Too expensive**

**Not needed**

**I'll handle it myself**

**Send a voice message**

This makes the family interaction human.

---

# CRITICAL FEATURE: "CALL MY CHILD"

Make calling incredibly accessible.

Button:

**Call My Child**

When tapped:

### Calling Sarah...

Large phone icon.

**End Call**

No complicated contact screen.

---

# HOME SCREEN STATUS

When there is an active request, the elderly home screen should change.

Instead of:

“What do you need help with?”

Show:

### Your request is being handled.

**Milk + Bread**

Status:

🟢 **Approved**

**A helper is getting it for you.**

Button:

**See Request**

And still keep the giant microphone available.

---

# EMPTY STATE

If no requests exist:

### Nothing to worry about.

**When you need something, just tap the microphone.**

---

# ERROR STATES

Never show technical errors like:

“API Error 500.”

Instead:

### Something went wrong.

**Please try again.**

Buttons:

**Try Again**

**Call My Child**

---

# OFFLINE / POOR INTERNET EXPERIENCE

Design a state where the request cannot immediately be sent.

Show:

### Your request is saved.

**We'll send it when you're connected.**

This is particularly important because elderly users should not have to understand connectivity problems.

---

# TRUST & PRIVACY

Create a simple privacy explanation.

Do not use legal jargon.

Example:

### Your family is in control.

**Your request is only shared with the family members and helpers needed to complete it.**

Use:

✓ Family approval
✓ Trusted helpers
✓ Request history

---

# PERSONALIZATION

Create a lightweight profile.

Example:

**Mary**

Preferred language:

**English**

Family:

**Sarah — Daughter**

Home:

**Saved**

Common requests:

* Groceries
* Medicine
* Household help
* Transportation

Do NOT make the user configure dozens of settings.

---

# REPEAT REQUESTS

A powerful convenience feature:

### Need your usual groceries?

Button:

**Order My Usual**

This should use previous requests as a shortcut.

The elderly user should not have to repeat complicated requests.

---

# MULTILINGUAL ACCESSIBILITY

Include a language selection during onboarding.

Example:

**Choose your language**

English
ಕನ್ನಡ
हिन्दी
தமிழ்

Keep this screen visual and simple.

For the prototype, demonstrate English + Kannada support.

The important concept is:

**The user speaks naturally in their preferred language.**

---

# ONBOARDING

Do NOT create a long onboarding process.

Maximum 3 screens.

Screen 1:

**Welcome to Assist Me**

“Just tell us what you need.”

Button:

**Get Started**

Screen 2:

**Who helps you?**

Add family member:

**My daughter**

Screen 3:

**You're ready.**

**Whenever you need something, tap the microphone.**

Button:

**Start**

---

# DEMO SCENARIO

Build the prototype around one extremely clear story.

Mary is an elderly woman living alone.

Her daughter Sarah lives in another city.

Mary needs groceries.

Mary taps the microphone.

Mary says:

> “I need milk, bread and biscuits.”

Assist Me transcribes it.

Mary confirms.

Sarah receives:

**Mom needs groceries.**

Sarah taps:

**Approve**

Assist Me finds a trusted helper.

Helper accepts.

Helper buys groceries.

Helper marks:

**Delivered**

Mary receives:

**Your groceries have arrived.**

Sarah receives:

**Delivered successfully.**

This should be the main clickable prototype flow.

---

# SECOND DEMO SCENARIO

Demonstrate intelligent safety.

Mary says:

> “I need my medicine.”

Assist Me asks:

**Which medicine?**

Mary selects:

**My usual medicine**

The request is sent to Sarah for approval.

This demonstrates that the system does not blindly execute ambiguous requests.

---

# THIRD DEMO SCENARIO

Demonstrate non-shopping assistance.

Mary says:

> “My ceiling fan isn't working.”

Assist Me understands:

### Home repair request

**Ceiling fan not working**

Button:

**Send to my child**

Sarah approves.

A helper receives:

**Home repair task**

This establishes that Assist Me is an assistance platform, not merely grocery delivery.

---

# INFORMATION ARCHITECTURE

Use three simple experiences.

## ELDERLY

Home
→ Speak
→ Confirm
→ Request Status

## FAMILY

Requests
→ Review
→ Approve / Reject
→ Track

## HELPER

Available Tasks
→ Accept
→ Complete
→ Confirm Delivery

Avoid complex navigation.

---

# COMPONENT SYSTEM

Create reusable components:

* Primary button
* Secondary button
* Danger button
* Giant microphone button
* Voice listening state
* Voice transcription card
* Request card
* Status card
* Approval card
* Helper task card
* Confirmation screen
* Family notification
* Accessibility control
* Voice playback button
* Call button
* Trust badge
* Status timeline
* Bottom navigation
* Error state
* Empty state

Use Auto Layout and responsive constraints.

Create variants for:

Default
Pressed
Disabled
Loading
Success
Error

---

# MICROPHONE COMPONENT

This is the signature visual element of Assist Me.

Create a large accessible microphone button.

Minimum touch target:

72px.

Prefer:

96–120px.

Use a subtle pulse animation only while listening.

States:

1. Idle
2. Pressed
3. Listening
4. Processing
5. Confirmation
6. Error

Do not use aggressive animations.

---

# ICONOGRAPHY

Use universally recognizable icons.

Microphone
Phone
Check
X
Speaker
Clock
Home
Person
Location
Package
Alert

Always pair unfamiliar icons with text.

---

# DESIGN FOR TOUCH

All important buttons must be large enough for older users.

Avoid:

* tiny close buttons
* tiny dropdowns
* tiny links
* swipe-only interactions
* drag-and-drop
* hidden gestures
* long forms

Everything should work with simple taps.

---

# ACCESSIBILITY

Design for:

* large text
* high contrast
* keyboard accessibility
* screen readers
* visible focus states
* large touch targets
* reduced motion
* audio feedback
* simple language

Never communicate meaning using color alone.

For example:

Don't show only a green dot.

Show:

**✓ Approved**

---

# UX COPY RULES

Use human language.

Bad:

“Request submitted successfully.”

Good:

**Your request has been sent.**

Bad:

“Authentication failed.”

Good:

**We couldn't sign you in. Try again.**

Bad:

“Transaction pending.”

Good:

**Your child is reviewing your request.**

Bad:

“Fulfillment complete.”

Good:

**Your request has arrived.**

---

# VISUAL HIERARCHY

Every screen should answer:

1. Where am I?
2. What happened?
3. What do I do next?

There should almost never be more than one primary action.

---

# HACKATHON WOW MOMENT

Create a polished prototype moment where the elderly user speaks naturally.

Show:

🎙️

**Listening...**

Then transform the speech into:

### I understood:

**Milk + Bread + Biscuits**

Then show:

**Estimated cost: ₹300**

Then:

**Send to Sarah**

After Sarah approves:

**✓ Sarah approved your request**

Then:

**Finding a trusted helper nearby...**

Then:

**✓ Helper accepted**

Finally:

### You're all set.

**Your groceries are on their way.**

This sequence should feel magical while remaining understandable.

---

# DEMO DASHBOARD

Create one optional presentation/dashboard screen for judges.

Title:

**Assist Me Impact**

Show simple metrics:

**12** requests completed

**4** family members connected

**8 min** average approval time

**100%** family-approved tasks

Do not overdo analytics.

The product is about people, not dashboards.

---

# LANDING PAGE

Create a separate landing page for the hackathon presentation.

Hero:

### Help is just a conversation away.

Subheading:

**Assist Me helps older adults ask for everyday things using their voice — while keeping their families in control.**

Primary CTA:

**See How It Works**

Secondary CTA:

**Try the Demo**

Hero visual:

An elderly person interacting with the huge microphone.

Show a simple three-step flow:

### 1. Speak

Tell Assist Me what you need.

### 2. Family Approves

Your family decides what happens.

### 3. A Trusted Helper Helps

The task gets completed.

Closing statement:

**Because growing older shouldn't mean becoming less independent.**

---

# STORYTELLING FOR JUDGES

The prototype should visually communicate this problem:

**Millions of older adults can struggle with everyday digital tasks while their children live far away.**

Assist Me does not try to replace family.

It connects:

**Older Adult → Family → Trusted Helper**

The family remains the decision-maker.

---

# PRODUCT PRINCIPLES

Build everything around these five principles:

## 1. VOICE FIRST

The elderly user shouldn't need to type.

## 2. FAMILY CONTROL

Important requests require family approval.

## 3. HUMAN HELP

When technology cannot physically solve the problem, a trusted helper can.

## 4. SAFETY FIRST

Ambiguous or sensitive requests should trigger clarification rather than blind automation.

## 5. DIGNITY

The elderly person is not treated as helpless.

Assist Me helps them remain independent while keeping their family connected.

---

# IMPORTANT: DO NOT OVERDESIGN

This is critical.

Do NOT turn Assist Me into:

* Amazon for seniors
* a complicated healthcare dashboard
* a social network
* a delivery marketplace
* a chatbot with dozens of buttons
* a futuristic AI interface

The magic is:

**ONE BIG MICROPHONE.**

Everything else happens behind it.

---

# FIGMA FILE ORGANIZATION

Create pages:

01 — Design System
02 — Elderly Flow
03 — Family Flow
04 — Helper Flow
05 — Edge Cases
06 — Landing Page
07 — Prototype Demo

Name frames clearly.

Use Auto Layout.

Use reusable components.

Use consistent spacing.

Use responsive constraints.

Connect the primary prototype flow:

Elder Home
→ Listening
→ Transcription
→ Confirmation
→ Request Sent
→ Family Approval
→ Helper Acceptance
→ Delivery
→ Completed

Make the prototype presentation-ready.

---

# FINAL QUALITY BAR

The finished design should look like a product that could actually be launched, not a generic hackathon mockup.

Prioritize:

**clarity > features**

**trust > visual effects**

**accessibility > trends**

**human connection > complexity**

**real-world usefulness > gimmicks**

The final feeling should be:

> “My grandmother could actually use this.”

And the judge should immediately understand the entire product within 10 seconds.

The core experience must be:

# TAP → SPEAK → CONFIRM → FAMILY APPROVES → HELPER HELPS

Make Assist Me feel calm, trustworthy, accessible, emotionally warm, and exceptionally easy to use.
