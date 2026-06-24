/* ============================================================
   IBCC SKINCARE — interactions, 500+ reviews, live social proof
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.IBCC || { rating: "4.9", reviewCount: 2847, reviewPhotos: [], productImg: "" };

  /* ---------- seeded RNG (deterministic per load order) ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var rng = mulberry32(20260617);
  function pick(arr) { return arr[Math.floor(rng() * arr.length)]; }
  function chance(p) { return rng() < p; }

  /* ---------- review content pools (large, human-style) ---------- */
  var NAMES = [
    "Sophie M.","Aaliyah R.","Mia T.","Camila G.","Hannah L.","Yuki N.","Isabella F.","Chloe W.","Amara O.","Léa B.",
    "Grace K.","Zoé P.","Emma S.","Naomi V.","Priya D.","Olivia H.","Sofia A.","Lucia R.","Ava C.","Maya J.",
    "Elena T.","Hana K.","Jasmine B.","Nour E.","Daria V.","Freya N.","Lina M.","Aria S.","Ruby C.","Talia W.",
    "Bianca L.","Sara H.","Mei L.","Carmen O.","Ingrid S.","Noa B.","Layla F.","Anaïs D.","Keira M.","Tara V.",
    "Selina R.","Paige T.","Renata C.","Manon L.","Esma Y.","Valentina P.","Cleo B.","Dahlia N.","Farah K.","Greta H.",
    "Marie D.","Lauren P.","Adaeze N.","Sun-hee P.","Ji-woo K.","Wei L.","Fatima Z.","Beatriz S.","Anna K.","Heidi R.",
    "Nadia M.","Rosa V.","Tessa B.","Yara A.","Dana K.","Erin M.","Pia S.","Aisha B.","Lara T.","Kim D.",
    "Megan F.","Sienna W.","Charlotte E.","Nina K.","Vera S.","Lily C.","Brooke H.","Imani O.","Rania E.","Sabrina L.",
    "Daniela R.","Eva M.","Hailey P.","Joanna K.","Maddie C.","Phoebe T.","Quinn R.","Sasha V.","Tanya B.","Una D.",
    "Veronica P.","Wendy L.","Ximena G.","Yasmin K.","Zara H.","Amelia N.","Bella R.","Cora S.","Delia M.","Elif Y.",
    "Marcus T.","David L.","James R.","Daniel K.","Omar S.","Liam P.","Rachel G.","Michelle W.","Ashley T.","Brittany C.",
    "Christina L.","Diana S.","Emily R.","Francesca M.","Gabrielle H.","Helen P.","Irene K.","Jessica B.","Karen N.","Laura F.",
    "Monica D.","Nicole J.","Patricia A.","Rebecca S.","Stephanie M.","Teresa V.","Vanessa C.","Whitney L.","Yvonne R.","Zoe T.",
    "Amber H.","Bethany K.","Caitlin O.","Denise M.","Erica W.","Fiona L.","Gina P.","Holly R.","Ivy S.","Jenna B.",
    "Katie M.","Leah F.","Molly T.","Natalie C.","Ophelia D.","Paula G.","Rita K.","Stacy N.","Tracy W.","Uma P."
  ];

  var TITLES_5 = [
    "Obsessed is an understatement","My new everyday must-have","Skin twin in a tube","Better than my $60 foundation",
    "Glow without trying","Where has this been all my life?","Flawless but still looks like me","Worth every penny honestly",
    "Already repurchasing","The your-skin-but-better effect is REAL","Holy grail found","Three coworkers asked what I'm wearing",
    "Effortless radiance","Lightweight perfection","Actually self-adjusting (not marketing fluff)",
    "Saved my dull winter skin","Can't stop reaching for it","Breathable coverage finally","This little tube is magic",
    "Five stars isn't enough","Mom stole mine","Wore it to a wedding and got compliments all night",
    "Replaced three products","No more cake face","Dewy not greasy","My redness is gone",
    "SPF + coverage + skincare??","K-beauty girl approved","Dermatologist visit went better lol",
    "Husband noticed (that never happens)","School run friendly","Zoom-ready in 30 seconds","Gym then brunch, still looked fine",
    "Better than Erborian for me","IT Cosmetics who?","Laneige vibes, half the steps","Charlotte Tilbury dupe energy",
    "Tube #3 incoming","Bought one for my sister","Travel essential now","No breakouts (huge for me)",
    "Melts in like skincare","Looks like I slept 8 hours","Finally a CC that doesn't oxidize orange"
  ];

  var TITLES_4 = [
    "Really lovely, one small note","Great everyday cream","Almost perfect","Lovely glow, learning curve",
    "Very happy overall","Solid CC cream","Good coverage, light feel","Pleasantly surprised",
    "Would still recommend","4.5 stars if I could","Great but read the tips","Better than expected",
    "Daily driver material","Minor shade learning curve","Takes a minute to get right","Love it with the right prep",
    "Not perfect, still great","Impressed for the price","My go-to on busy mornings","Works, just don't overdo it"
  ];

  var TITLES_3 = [
    "Good but needs technique","Nice, took some blending","Decent for the price","Works if you go slow",
    "Shade tip inside","Not bad, not holy grail","Okay with adjustments","Give it a fair shot",
    "Mixed feelings but keeping it","Fine once I figured it out","Average-good"
  ];

  var SKIN = [
    "Combination skin","Dry skin","Oily skin","Sensitive skin","Mature skin","Normal skin","Acne-prone skin",
    "Dehydrated skin","Rosacea-prone","Fair skin","Medium skin","Deep skin","Olive undertone","Cool undertone","Warm undertone"
  ];

  var SHADES = ["#2 Light","#1 Dark"];
  var AVATAR_COLORS = ["#c08a7d","#b76e79","#cfa07e","#a8675d","#d39b86","#9a6f63","#c98e63","#bb7f74","#d4a574","#a85d52"];

  /* complete human-written reviews (5 star) */
  var BODY_5_FULL = [
    "Okay so I was fully prepared to hate this. I've been burned by CC creams that go orange by noon. This one actually warms up on my skin and settles into something that looks like... me, but rested. My husband literally said I looked 'less tired' and he never notices makeup.",
    "I wear this to work five days a week. One pea-sized dot, fingers, done. No brush, no sponge, out the door in four minutes. It covers the redness on my cheeks without looking like I'm wearing foundation. That's the whole dream right?",
    "Bought it because my cousin wouldn't shut up about it. She was right. I'm 47, I have fine lines around my eyes, and most bases sit in them and look awful. This doesn't. It kind of blurs everything and my skin still looks like skin.",
    "The white-to-skin thing is not a gimmick. I put it on my hand first just to test and watched it change color. Kind of freaked me out in a good way? On my face it matched within like 10 seconds of blending.",
    "I have rosacea and I'm scared of everything new. Patch tested on my jaw, waited two days, no reaction. Full face — no burning, no bumps. The Centella thing might actually be doing something because my cheeks feel calmer even at the end of the day.",
    "Replaced my moisturizer + primer + light foundation routine. Three steps down to one. My bathroom shelf thanks me. Skin looks dewy but not oily — I'm combo and that balance is hard to find.",
    "Wore this to my sister's wedding. Outdoor photos, harsh sunlight, sweaty dance floor. Still looked even in every picture. My bridesmaid group chat asked for the link. That says it all.",
    "I'm a nurse. 12-hour shifts, mask on and off all day. This doesn't rub off weirdly on the mask and my skin doesn't feel suffocated underneath. Big win.",
    "Compared it side by side with my Erborian CC. Similar vibe but this one feels lighter and the shade match on me is better. Not throwing shade at Erborian — just saying this earned its spot.",
    "My teen daughter borrowed it once and now we fight over the tube. Ordering a second one so we stop arguing. The Light shade works on both of us which is kind of wild.",
    "I don't usually leave reviews but I keep getting compliments from strangers? Like at the grocery store. One lady asked if I had a facial. I was just wearing this and lip balm.",
    "Postpartum skin was a mess — dull, uneven, tired. This was the first thing that made me feel human again without a full makeup routine. Low effort, high reward.",
    "The finish is that soft-focus thing influencers talk about but you never actually get. Pores look smaller. Not invisible, just softer. Natural light, bathroom light, all good.",
    "I live in Florida. Humidity destroys my face. This held up through a farmers market in July. Not perfect at hour 8 but still presentable, which is more than I can say for most things.",
    "Got the Dark shade for summer when I self-tan. Adapts well. Doesn't look muddy on my neck when I blend down. Huge plus because that's usually where CC creams fail me.",
    "I'm lazy with skincare in the morning. This over my vitamin C serum and I'm done. SPF in it is a bonus — I still use my regular sunscreen on beach days but daily errands I'm covered.",
    "First week I used too much and looked a little dewy-heavy. Second week I used half the amount and it clicked. Less is genuinely more with this formula.",
    "My dermatologist said my barrier was irritated from too many actives. Switched to simpler makeup and this was part of that. Skin calmed down within a couple weeks. Coincidence? Maybe. But I'm not stopping.",
    "The tube is small but it lasts. I'm on month two of daily use and maybe a third gone? A little goes far.",
    "I have deep acne scars and this doesn't cover them 100% — nothing does without concealer — but it evens the overall tone so much that I don't feel the need to layer foundation on top anymore.",
    "Bought during a sale, figured worst case I'd return it. Kept it. Bought two more. No regrets.",
    "My makeup artist friend said CC creams are mostly hype. She tried mine at brunch and ordered it before dessert arrived.",
    "I have very fair skin with pink undertones. Light shade looked scary white at first squeeze but blended out neutral and alive. No gray cast.",
    "Menopause hit my skin like a truck — dryness, random redness, texture I never had before. This is gentle and makes me look like I still have my pre-2020 skin. I'll take it.",
    "Used it for a video call then went straight to pickup without redoing anything. Looked fine in person too. That's rare for me.",
    "The scent is basically nothing, which I prefer. No perfume-y sunscreen smell. My sensitive nose approves.",
    "I layer a cream blush on top and it doesn't pill or break up. Took me years to find a base that plays nice with cream products.",
    "Gym test: light sweat, no streaking down my face like a raccoon. I wasn't expecting perfection but it passed.",
    "My mother-in-law (very honest woman) said I looked 'fresh.' That's basically a five-star review from her.",
    "I was using IT Cosmetics CC for years. This feels lighter, less heavy by afternoon, and the shade shift technology actually works on my olive skin. Converted.",
    "Dark circles are still there if you look close, but the overall face looks so much more even that you stop noticing them. That's the magic.",
    "Packaging feels nicer than the price point. Silver tube, satisfying cap click. Small thing but it feels premium on the vanity.",
    "I have textured skin from old breakouts. This doesn't emphasize bumps the way matte foundations do. Satin finish is forgiving.",
    "Bought for a trip to Seoul because K-beauty inspired — wore it every day walking 20k steps. Comfortable, didn't melt off.",
    "My boyfriend thought I was 'naturally glowy' today. I told him it's $35 cream. He said buy more. Done.",
    "I use it as a primer under full glam on weekends too. Works both ways — sheer for daily, base layer for events.",
    "Sun spot on my cheek is still faintly visible but the redness around it is gone so it bothers me way less.",
    "No white cast in flash photos. Took selfies at a restaurant with those awful overhead lights. Looked normal. Blessed.",
    "I have eczema patches near my nose. This didn't sting or make them flare. Careful application there but no drama.",
    "Third tube. I don't repurchase often. This made the cut.",
    "Coworker asked if I got Botox. I said no, just sleep and this CC cream. She laughed but ordered it anyway.",
    "The adapt-to-skin thing sounded like marketing but my sister (different skin tone) and I both use Light and it works on both of us. Weird science but ok.",
    "I stopped wearing powder over my base because I don't need it anymore. Skin stays put, not slippery, not dry.",
    "Night out: wore from 6pm to 1am. Faded a little on the nose but nothing embarrassing. Didn't touch up once.",
    "I'm 29 and was getting into 'real' foundation — this pulled me back to easy. Sometimes simple is better.",
    "Acne-prone and paranoid. No new breakouts in 6 weeks of daily use. That's my personal benchmark for a pass.",
    "The glow is real but not glittery or shiny. More like healthy skin reflecting light. Very Laneige glass skin lite.",
    "I apply with damp fingers after toner. Takes 20 seconds. My old routine was 15 minutes. Life changing for school mornings.",
    "Returned two other CC creams from Amazon before finding this. Third time's the charm I guess.",
    "My aesthetician asked what I've been using because my skin looked less inflamed. Told her about the Centella in this. She nodded like that checks out.",
    "Light coverage but you can build on blemishes with a second tiny dot. Flexible without getting cakey.",
    "I was worried about SPF 25 being enough — I still use dedicated sunscreen, but nice to have backup for days I'm rushing.",
    "Doesn't settle into my smile lines by lunch. I'm 52. That's the bar and this clears it.",
    "Bought the bundle (2+1) and gave one to my best friend. She texted me a week later: 'why did you wait so long to tell me about this.'",
    "Color match on my chest/neck is usually impossible. Blended down with a damp sponge and it disappeared. No line.",
    "I have hooded eyes and base always creases on my lids when I do a full face. Don't put this on lids obviously but nothing weird happened on the perimeter. Small win.",
    "Smells clean, feels cool going on, dries down to skin. The sensory experience is nice — sounds silly but it makes me want to use it.",
    "I'm a teacher. Kids are honest. Nobody said I look weird. Adult coworkers complimented me. I'll count that as success.",
    "Dry patches on my chin used to make foundation look scaly. This sits on top smoothly if I moisturize first. Hydrating enough for me.",
    "I use Dark in summer, Light in winter. Both work. The self-adjust thing gives you wiggle room which I appreciate.",
    "Honestly thought it would be another TikTok overhyped product. It's not. It's just good.",
    "My skin looks like I have a filter on in real life. Not plastic — just even and bright. I'll take it.",
    "Husband's wedding photos from 2019 vs our anniversary dinner last week — I looked more rested now. This + sleep helps.",
    "I don't set it with spray or powder. Just goes on and stays. Low maintenance queen behavior.",
    "The white cream moment is satisfying to watch blend. I made my roommate try it on her hand and she ordered before I finished explaining.",
    "Sensitive around my eyes — I avoid the eye area but nothing migrated or stung. Contact lens wearer, no issues.",
    "Better than any cushion compact I've tried for everyday. Faster too.",
    "I have a birthmark on my cheek. This doesn't fully cover it but tones down the redness around it so it's less noticeable. Good enough for daily.",
    "Five stars because it does exactly what it says without lying to you. Light, correcting, skin-like. Delivered.",
    "Ran out on vacation and used hotel foundation for one day. Hated it. Never leaving home without this again.",
    "My skin type changed after pregnancy. Old holy grails stopped working. This one stuck — rare.",
    "I was using tinted moisturizer that disappeared by 10am. This lasts until I take it off. Visible difference.",
    "No pilling with my hyaluronic acid serum underneath. Waited 60 seconds between layers. Perfect.",
    "I have large pores on my nose. Blurred, not erased — realistic expectation met.",
    "Bought for my mom (65). She called me confused because the cream 'changed color on her face.' Explained it. She loves it now. Cute.",
    "Office fluorescent lights are the ultimate test. Looked normal. Not gray, not orange. We love to see it.",
    "I do skincare at night, minimal morning. This is my morning. Cleanser, this, brows, lip. Out.",
    "The tube fits in my smallest purse. Touch-ups aren't really needed but I like knowing I could.",
    "Friend with deeper skin tried my Dark shade — worked on her too. The range is forgiving.",
    "I get hormonal breakouts on my chin. This doesn't irritate them and doesn't look patchy over healing spots.",
    "Replaced my NARS tinted moisturizer for daily use. Saving money and time.",
    "I was today years old when I learned CC cream could feel like skincare. Game changer.",
    "Skin looks good in the car mirror, bathroom mirror, and iPhone front camera. The trifecta.",
    "I apply with a brush on lazy days, fingers on rushed days. Both work. Versatile.",
    "No transfer onto my white collar at work. Huge for office days.",
    "I have vitiligo patches. Doesn't cover them fully (nothing will) but evens the surrounding skin so everything looks more harmonious.",
    "My teenage son asked why I look younger in recent photos. It's this and better lighting but mostly this.",
    "Bought skeptically. Now I'm the person who won't shut up about it. Full circle.",
    "Centella + color correct + SPF in one? Sign me up. Simplifying my routine was the goal and this nailed it.",
    "I wore it snorkeling-adjacent (beach day, not in water) and sweat a lot. Held up better than expected.",
    "The finish photographs beautifully. Content creator friend borrowed it for a shoot. Bought her own.",
    "I have combination oily T-zone. Didn't get shiny until hour 6. Blotting once fixed it. Acceptable.",
    "Dark shade on me in winter looks natural. No mask effect. Blended into hairline and ears.",
    "I stopped using concealer under my eyes for daily life. This is enough. One less step.",
    "My skin felt tight with old matte foundations. This feels comfortable all day. Like wearing lotion.",
    "Gifted one to my sister-in-law. She texted a heart emoji and a Sephora screenshot. Success.",
    "I use it over sunscreen that pills with everything. No pilling. Miracle.",
    "The 'transparent' finish description is accurate. You look polished, not made up.",
    "I'm on tube two. Still love it. That never happens with base products for me.",
    "Applied in a rush before school drop-off. Looked put together at the PTA meeting. Mission accomplished.",
    "Better shade match than my custom-mixed foundation from a department store. I'm still processing that.",
    "I have fine baby hairs at my hairline. Blended into them without turning gray. Details matter.",
    "No breakouts on my jawline after a month. My skin purges from new products usually. This didn't.",
    "I was embarrassed about my uneven tone. This fixed 80% of it in 30 seconds. Confidence boost is real.",
    "Works on my neck and chest when I remember to blend down. No weird color jump.",
    "I layer cream bronzer on top — blends like a dream. No fighting between products.",
    "My partner said my skin looks 'soft.' Romantic? Maybe. Accurate? Yes.",
    "I have allergies to fragrance in makeup. This doesn't bother me. Check ingredients if you're sensitive but I'm good.",
    "Bought at 11pm impulsively. Best impulse buy of the year.",
    "I use less than I think I need. Tube will last forever. Economical too.",
    "Skin looks alive. Not flat, not shiny. Alive. That's the word.",
    "I recommended it to three friends. All three repurchased. I should get commission lol.",
    "Morning routine: skincare, this, done. Evening: double cleanse, skincare. Skin happy.",
    "I have a job on camera twice a week. This holds up under ring light. Approved.",
    "The coverage is 'your skin but you slept well and drank water.' Perfect daily amount.",
    "I was using powder foundation that aged me. This is the opposite. Soft and youthful.",
    "No oxidation on my hands hours later. Some bases turn orange on me by lunch. This stayed true.",
    "I have sensitive eyes — watery, allergic. Nothing about wearing this triggered that. Relief.",
    "Bought for travel size logic — one product, less luggage. Stayed for the results.",
    "My skin barrier was wrecked from over-exfoliating. Gentle makeup was a must. This qualified.",
    "I look like I have a professional doing my makeup when really I rubbed cream on in the car. Fine by me.",
    "The before/after on the site is accurate. I showed my friend my bare face vs one layer. She gasped.",
    "I don't write reviews. I'm writing this one. That should tell you something.",
    "Ten out of ten. No notes. Repurchasing forever."
  ];

  var BODY_4_FULL = [
    "Really like this overall. Coverage is natural and my skin feels calm wearing it. Only reason it's not 5 stars: I needed a week to figure out the right amount. Too much at first and I looked a little too glowy on my oily forehead. Half a pea size fixed it.",
    "Solid daily CC. Shade match is great once blended. Takes maybe 30 seconds longer than my old tinted moisturizer to look seamless. Worth it for how my skin looks by afternoon though — less patchy.",
    "My skin loves the Centella. Redness is down. I wish the tube were bigger for the price, but a little goes a long way so I'm splitting the difference at 4 stars.",
    "Better than expected! Light shade works on my medium-light skin. On very sunny days I add a touch more powder on my nose by hour 5. Otherwise perfect.",
    "I have dry skin and this works beautifully over a good moisturizer. Without moisturizer it can cling to dry patches — prep matters. With prep, gorgeous.",
    "Replaced my foundation for everyday. For a full glam night I still use something heavier. For 90% of life this is my pick.",
    "The color changing thing is cool and it does match well. Cap is a bit fiddly on the tube. Minor packaging gripe, product itself is great.",
    "Four stars because I'm picky. Does everything it promises. Not quite 'changed my life' but definitely 'glad I bought it.'",
    "Took a star off because I wanted slightly more coverage on a dark spot. Buildable but I need concealer on top for that one area. Rest of face? Chef's kiss.",
    "Love the finish. SPF is a nice bonus. I'd love SPF 30+ for summer but 25 is fine for daily office life.",
    "Sister has the same shade as me and it looks slightly warmer on her. Still works but ymmv on undertones. On me it's perfect.",
    "First application I wasn't sold. Second day I used less product and warmer fingers and it clicked. Give it two tries.",
    "Comfortable all day. Slight fade on the chin after eating a greasy lunch. Who doesn't have that problem though.",
    "Good for sensitive skin — no stinging. Took off one star because I prefer a matte option for very hot days. This is dewy.",
    "The glow is beautiful. My oily T-zone needs a blotting sheet once. Still my favorite CC right now.",
    "Works great with my skincare routine. Pilled once when I rushed and didn't let serum sink in. User error. When I wait 30 sec, flawless.",
    "Honest review: really good. Not perfect on my deeper acne scars without spot concealer. For overall tone evening, excellent.",
    "I wanted something between bare skin and foundation. This is exactly that. Wish I'd discovered it sooner — minus one star for making me buy three tubes in two months lol.",
    "Light scent I barely notice. Husband has a strong nose and didn't complain. Product stays put through a normal workday.",
    "Shade Dark is great in summer. Light in winter. Both 4-star products — Dark pulls slightly warm on me in deep winter but still wearable.",
    "My mom (70) uses it and loves how it doesn't settle in her lines. I steal it when I visit. We need two tubes in that house.",
    "Compared to Erborian: similar category, this feels a touch lighter on me. Erborian felt richer. Preference thing. I prefer this.",
    "Application tip that helped me: start at center of face, blend outward. Game changer for even coverage.",
    "I get 6-7 hours of great wear, 8-9 of good wear. For a CC that's normal I think. Still better than my last one.",
    "Four stars. Would recommend to friends. Already have. One friend returned it — deeper skin, shade wasn't right. Light/Dark system works for most but not all.",
    "Nice natural finish. Doesn't oxidize. Packaging arrived with a tiny dent on the box, tube fine. Petty reason for hesitation but product earned 4 stars anyway.",
    "I use it 5 days a week. Weekend I go bare. Skin looks better on Monday when I start again — sign it's not clogging me.",
    "Good value on sale. Full price I'd still buy but I'd think about it longer. On sale it's a no-brainer.",
    "Blends well with fingers. Brush is optional. Sponge eats too much product imo.",
    "Rosacea-friendly for me. Doesn't fix flare days completely but doesn't make them worse. That's a win.",
    "I like that it's skincare-forward. Skin feels softer at end of day. Makeup that doesn't feel like punishment.",
    "Almost perfect. One star off for me wanting a pump instead of a squeeze tube. Squeeze tube is fine. I'm dramatic.",
    "Coverage is light-medium. I knew that going in. Delivers on that promise. Great for 'no makeup makeup.'",
    "My dermatologist-approved routine plus this = happy skin. No new milia, no clogged pores in two months.",
    "Took off a star because shipping took an extra day. Product great. Logistics meh.",
    "I have combination skin in a dry climate. Works with humidifier + this. Alone in January it was slightly dry on cheeks. Moisturizer fixed it.",
    "Really impressed for the price point. Feels more expensive than it is. Not quite luxury department store but close enough for daily.",
    "The white-to-skin transition is fun to show people. Actual wear is even better. Slight learning curve on amount.",
    "I'd rate 4.5 if I could. Rounding down because nothing is perfect. But I'm repurchasing so that says plenty.",
    "Good for zoom calls. Slightly too dewy for HD on my oily skin without powder. Powder fixes it. Still daily driver.",
    "My go-to for errands and coffee dates. For a wedding I'd layer more. Perfect tool for the right job.",
    "Centella seems legit — less redness over time, could be the cream could be my new serum. Either way skin looks healthier.",
    "Four stars. Happy customer. Will update if anything changes but month 2 still going strong."
  ];

  var BODY_3_FULL = [
    "It's okay. Does even out my skin a bit. You HAVE to use a tiny amount — I looked ghostly the first time because I used too much. Less is more, seriously.",
    "Decent for the price. Shade took a few days to figure out on my olive skin. Light works but I have to blend down my neck carefully.",
    "Not bad. Not holy grail. Coverage is lighter than I expected even after reading the description. Fine for casual days.",
    "The adapting color thing works but slowly on me. I need to blend longer than other CC creams. Results are good once I get there.",
    "Three stars because it pilled with my sunscreen once. Might have been the sunscreen. Tried again with a different SPF and it was fine. Inconsistent first impression.",
    "Good for good skin days. On breakout days I need concealer. Fair enough.",
    "I wanted more coverage on hyperpigmentation. This helps but doesn't eliminate. Realistic for a light CC.",
    "Texture is nice. Shade is slightly too warm on me in winter. Better in summer with a tan. Seasonal product for me.",
    "Takes practice. Watch a tutorial mentally — pea size, warm fingers, pat don't rub. Once I learned that, bumped from 2 to 3 stars in my head.",
    "Average-good. My friend loves it. I'm lukewarm. Skin type differences maybe.",
    "Clings to my dry nose flakes if I don't exfoliate. User prep issue but worth mentioning.",
    "Fine. Repurchasing? Probably not. Finishing the tube? Yes.",
    "SPF is nice. Finish is nice. Shade match is 80% on me. Close but not quite.",
    "I have deep skin and Dark works but pulls a tiny bit gray in indoor light. Outdoor it's fine. Mixed.",
    "Not for very oily skin without powder. I get shiny by hour 4. Acceptable with blotting paper.",
    "Three stars — it's good starter CC if you're new to the category. Veterans might want more oomph.",
    "Packaging is pretty. Product is fine. Expected more wow from the reviews. Maybe my bar was too high.",
    "Works better in humid weather than dry winter air on me. Climate dependent.",
    "I prefer a matte finish. This is dewy. My mistake ordering without checking finish type.",
    "Okay product. Good ingredients list. Results moderate on my stubborn redness.",
    "Give it two weeks before judging. I almost returned it day 3. Glad I didn't but still only 3 stars because the start was rough."
  ];

  /* sentence fragments for stitched reviews */
  var HOOKS = [
    "Not gonna lie,","Okay real talk —","So I've had this about {weeks} weeks now,","Full disclosure:","Update after {weeks} weeks:",
    "I never leave reviews but","My sister made me try this and","Bought this during a late-night scroll and","Was fully ready to return this and",
    "As someone with {skin} who's tried everything,","I'm {age} and my skin hasn't been easy,","Quick review from a busy mom:",
    "Dermatologist told me to simplify my routine so","Saw this on my feed a million times and finally caved.",
    "Between work and kids I have 3 minutes for makeup.","I've gone through two tubes already so","First impressions were meh. Second week? Different story.",
    "Not a makeup person but","My coworker kept asking what foundation I use — it's not foundation,","Husband thought I wasn't wearing makeup. Correct.",
    "Patch tested like a paranoid person because","I have a wedding / interview / photoshoot coming up and"
  ];

  var WINS = [
    "the shade actually warms up and matches instead of going orange.",
    "my redness looks calmed, not just covered.",
    "it feels like skincare — no tight or cakey feeling by afternoon.",
    "one thin layer does more than my old tinted moisturizer ever did.",
    "my pores look softer, not erased but softer.",
    "it layers over serum without pilling (if I wait 30 sec).",
    "I stopped wearing powder on top. Don't need it.",
    "the Centella seems to help — less reactive by end of day.",
    "it survived a full workday and school pickup.",
    "people keep saying I look rested. I'm not rested. It's this.",
    "the finish is dewy without looking sweaty on my combo skin.",
    "it doesn't settle into my smile lines like my old base.",
    "Dark/Light both worked better than I expected on my undertone.",
    "flash photos didn't give me white cast. Bless.",
    "I use less product than I thought — tube lasts ages.",
    "it replaced primer + light foundation for me.",
    "my acne-prone skin didn't freak out. Huge.",
    "blends with fingers in the car. Lazy-girl approved.",
    "coverage is 'your skin but you drink water and sleep.'",
    "it plays nice with cream blush. Finally."
  ];

  var BUTS = [
    "Only knock: use half what you think you need.",
    "Took me a few tries to get the amount right.",
    "I still use concealer on one dark spot — everything else fine.",
    "Gets a little shiny on my nose by hour 5 — blot once and good.",
    "Wish the tube were bigger for the price.",
    "Needs moisturizer underneath on my dry patches.",
    "Cap is finicky but whatever, product delivers.",
    "Not full coverage — knew that, still worth saying.",
    "Learning curve on blending but worth it.",
    "SPF 25 is bonus not replacement — I still use sunscreen outdoors."
  ];

  var CLOSERS = [
    "Already on my second tube.","Would buy again.","Telling everyone I know.",
    "If you're on the fence, just try it.","Better than my $50 foundation honestly.",
    "My new daily driver.","No regrets.","Worth the hype for me.",
    "Skin looks like skin, just better.","10/10 for low-effort mornings.",
    "Gifted one to my mom — she loves it.","Repurchasing before I run out.",
    "Didn't think I'd care this much about a CC cream.","Simple routine, good results. Done."
  ];

  var SHORT_5 = [
    "Holy grail. Done.","Obsessed. Tube #2 ordered.","Skin but better. Accurate.",
    "Replaced my entire base routine.","No notes. Perfect daily CC.",
    "Glowy, natural, easy. Love.","Best impulse buy this year.",
    "Zero breakouts. Full stop.","Shade match is scary good.",
    "Four-minute face. This is why.","Mom stole mine. Ordering two.",
    "Erborian who?","IT Cosmetics retired.","Wedding-proof. Photo-proof. Me-proof.",
    "Lazy girl makeup winner.","Centella + coverage = yes.",
    "Husband approved. That's the review.","Compliments at the grocery store. Sold.",
    "Dewy not greasy. Rare.","Fine lines friendly. 47 and thriving.",
    "Mask days at work — still works.","Florida humidity test passed.",
    "Third repurchase. That is all.","Your skin but you slept."
  ];

  var SHORT_4 = [
    "Really good, slight learning curve.","Love it with the right prep.",
    "4 stars — would still recommend.","Almost perfect. Repurchasing anyway.",
    "Great daily, not full glam.","Solid. Not holy grail but close.",
    "Figure out the amount — then gold.","Minor shine by afternoon. Still keeper.",
    "Good value. Happy skin.","Took a week to love it. Now I do."
  ];

  var SHORT_3 = [
    "Fine. Use less than you think.","Okay. Not amazing.","Decent. Needs technique.",
    "3 stars. Finishing the tube.","Light coverage as advertised.","Good skin days only for me.",
    "Blend longer than usual.","Worth trying, ymmv."
  ];

  var AGES = ["26","29","31","34","38","41","44","47","52","56","28","33","36","39","43"];
  var WEEKS = ["1","2","3","4","6","8","10","12"];

  function fillTemplate(str) {
    return str
      .replace(/\{age\}/g, pick(AGES))
      .replace(/\{weeks\}/g, pick(WEEKS))
      .replace(/\{skin\}/g, pick(SKIN).toLowerCase());
  }

  function stitchBody(rating) {
    var parts = [];
    if (chance(0.55)) parts.push(fillTemplate(pick(HOOKS)));
    parts.push(pick(rating >= 4 ? WINS : WINS));
    if (rating === 4 && chance(0.65)) parts.push(pick(BUTS));
    if (rating === 3 && chance(0.7)) parts.push(pick(BUTS));
    if (rating >= 4 && chance(0.5)) parts.push(pick(CLOSERS));
    if (rating === 5 && chance(0.35)) parts.push(pick(CLOSERS));
    return parts.join(" ").replace(/\s+/g, " ").trim();
  }

  function buildReviewBody(rating) {
    var roll = rng();
    if (rating === 5) {
      if (roll < 0.42) return pick(BODY_5_FULL);
      if (roll < 0.58) return pick(SHORT_5);
      if (roll < 0.88) return stitchBody(5);
      return pick(BODY_5_FULL) + (chance(0.4) ? " " + pick(CLOSERS) : "");
    }
    if (rating === 4) {
      if (roll < 0.45) return pick(BODY_4_FULL);
      if (roll < 0.58) return pick(SHORT_4);
      if (roll < 0.85) return stitchBody(4);
      return pick(BODY_4_FULL);
    }
    if (roll < 0.5) return pick(BODY_3_FULL);
    if (roll < 0.65) return pick(SHORT_3);
    return stitchBody(3);
  }

  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  function randomDate() {
    var now = new Date();
    var past = new Date(now.getTime() - Math.floor(rng() * 540 + 4) * 86400000);
    return MONTHS[past.getMonth()] + " " + past.getDate() + ", " + past.getFullYear();
  }

  /* ---------- build the review dataset ---------- */
  function buildReviews(n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var r = rng();
      var rating = r < 0.86 ? 5 : (r < 0.97 ? 4 : 3);
      var title = rating === 5 ? pick(TITLES_5) : rating === 4 ? pick(TITLES_4) : pick(TITLES_3);
      var body = buildReviewBody(rating);
      var name = pick(NAMES);
      var hasPhoto = CFG.reviewPhotos.length && chance(0.16);
      out.push({
        name: name,
        initial: name.charAt(0),
        color: pick(AVATAR_COLORS),
        rating: rating,
        title: title,
        body: body,
        date: randomDate(),
        skin: pick(SKIN),
        shade: pick(SHADES),
        photo: hasPhoto ? CFG.reviewPhotos[Math.floor(rng() * CFG.reviewPhotos.length)] : null,
        helpful: Math.floor(rng() * 240)
      });
    }
    return out;
  }
  var REVIEWS = buildReviews(540);

  function starHTML(n) {
    return '<span class="ibcc-stars">' + "★★★★★".slice(0, n) + '<span style="opacity:.25">' + "★★★★★".slice(n) + "</span></span>";
  }
  function reviewHTML(rv) {
    var photo = rv.photo ? '<div class="ibcc-review__photo"><img loading="lazy" src="' + rv.photo + '" alt="Customer photo from ' + rv.name + '"></div>' : "";
    return '<article class="ibcc-review">' +
      '<div class="ibcc-review__top">' +
        '<span class="ibcc-avatar" style="background:' + rv.color + '">' + rv.initial + '</span>' +
        '<div class="ibcc-review__who"><b>' + rv.name + '</b>' +
          '<span class="verified">✓ Verified Buyer · ' + rv.skin + '</span></div>' +
      '</div>' +
      starHTML(rv.rating) +
      '<div class="ibcc-review__title">' + rv.title + '</div>' +
      '<p class="ibcc-review__text">' + rv.body + '</p>' +
      photo +
      '<div class="ibcc-review__date">Shade ' + rv.shade + ' · ' + rv.date + '</div>' +
    '</article>';
  }
  function filterReviews(f) {
    if (f === "all") return REVIEWS;
    if (f === "photo") return REVIEWS.filter(function (r) { return r.photo; });
    var n = parseInt(f, 10);
    return REVIEWS.filter(function (r) { return r.rating === n; });
  }

  /* ============================================================ */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    /* ----- reveal on scroll ----- */
    var revealEls = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-visible"); ro.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { ro.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }

    /* ----- header stuck ----- */
    var header = document.getElementById("ibcc-header");
    var sticky = document.getElementById("ibcc-stickybuy");
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle("is-stuck", y > 40);
      if (sticky) sticky.classList.toggle("is-visible", y > 700);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ----- animated stat counters ----- */
    function animateCount(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || (el.textContent.indexOf("%") > -1 ? "" : "");
      var dur = 1600, start = performance.now();
      function fmt(v) {
        if (target >= 10000) return Math.round(v).toLocaleString();
        return Math.round(v).toString();
      }
      function step(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var counters = document.querySelectorAll("[data-count]");
    if ("IntersectionObserver" in window) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { co.observe(el); });
    } else {
      counters.forEach(animateCount);
    }

    /* ----- review summary bars ----- */
    var fills = document.querySelectorAll(".ibcc-bar__fill");
    if ("IntersectionObserver" in window) {
      var bo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.style.width = e.target.getAttribute("data-fill") + "%";
            bo.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      fills.forEach(function (el) { bo.observe(el); });
    } else {
      fills.forEach(function (el) { el.style.width = el.getAttribute("data-fill") + "%"; });
    }

    /* ----- gallery thumbs ----- */
    var galleryMain = document.getElementById("ibcc-gallery-main");
    document.querySelectorAll(".ibcc-thumb").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".ibcc-thumb").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        if (galleryMain) galleryMain.src = btn.getAttribute("data-thumb");
      });
    });

    /* ----- shade selector ----- */
    var shadeName = document.getElementById("ibcc-shade-name");
    document.querySelectorAll(".ibcc-shade").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".ibcc-shade").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        if (shadeName) shadeName.textContent = btn.getAttribute("data-shade");
      });
    });

    /* ----- FAQ accordion ----- */
    document.querySelectorAll(".ibcc-acc__q").forEach(function (q) {
      q.addEventListener("click", function () {
        var acc = q.closest(".ibcc-acc");
        var panel = acc.querySelector(".ibcc-acc__a");
        var open = acc.classList.toggle("is-open");
        panel.style.maxHeight = open ? panel.scrollHeight + "px" : 0;
      });
    });

    /* ----- newsletter ----- */
    var nf = document.getElementById("ibcc-news-form");
    if (nf) {
      nf.addEventListener("submit", function (e) {
        e.preventDefault();
        var msg = document.getElementById("ibcc-news-msg");
        msg.textContent = "✓ You're in! Your 10% code is on its way to your inbox.";
        nf.reset();
      });
    }

    /* ----- review grid (in-page preview) ----- */
    var grid = document.getElementById("ibcc-reviews-grid");
    function renderGrid(filter) {
      if (!grid) return;
      var list = filterReviews(filter).slice(0, 9);
      grid.innerHTML = list.map(reviewHTML).join("");
    }
    renderGrid("all");

    var pageFilters = document.getElementById("ibcc-filters");
    if (pageFilters) {
      pageFilters.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-filter]");
        if (!btn) return;
        pageFilters.querySelectorAll(".ibcc-chip").forEach(function (c) { c.classList.remove("is-active"); });
        btn.classList.add("is-active");
        renderGrid(btn.getAttribute("data-filter"));
      });
    }

    /* ----- reviews modal w/ infinite scroll ----- */
    var modal = document.getElementById("ibcc-modal");
    var modalBody = document.getElementById("ibcc-modal-body");
    var sentinel = document.getElementById("ibcc-modal-sentinel");
    var loading = document.getElementById("ibcc-modal-loading");
    var modalFilters = document.getElementById("ibcc-modal-filters");
    var BATCH = 12, cursor = 0, current = [];

    function resetModal(filter) {
      current = filterReviews(filter);
      cursor = 0;
      modalBody.querySelectorAll(".ibcc-review").forEach(function (n) { n.remove(); });
      loadMore();
    }
    function loadMore() {
      if (cursor >= current.length) { loading.style.display = "none"; return; }
      loading.style.display = "block";
      var slice = current.slice(cursor, cursor + BATCH);
      var frag = document.createElement("div");
      frag.innerHTML = slice.map(reviewHTML).join("");
      while (frag.firstChild) modalBody.insertBefore(frag.firstChild, loading);
      cursor += BATCH;
      if (cursor >= current.length) loading.textContent = "You've reached the end — thank you for reading!";
      else loading.textContent = "Loading more reviews…";
    }

    var msObserver = null;
    function openModal() {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("ibcc-noscroll");
      resetModal("all");
      if (modalFilters) modalFilters.querySelectorAll(".ibcc-chip").forEach(function (c, i) { c.classList.toggle("is-active", i === 0); });
      if ("IntersectionObserver" in window && !msObserver) {
        msObserver = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) loadMore();
        }, { root: modalBody, rootMargin: "200px" });
        msObserver.observe(sentinel);
      }
    }
    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("ibcc-noscroll");
    }
    ["ibcc-open-reviews", "ibcc-open-reviews-2"].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.addEventListener("click", openModal);
    });
    if (modal) {
      modal.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", closeModal); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
    }
    if (modalFilters) {
      modalFilters.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-filter]");
        if (!btn) return;
        modalFilters.querySelectorAll(".ibcc-chip").forEach(function (c) { c.classList.remove("is-active"); });
        btn.classList.add("is-active");
        modalBody.scrollTop = 0;
        resetModal(btn.getAttribute("data-filter"));
      });
    }

    /* ----- LIVE fake counters ----- */
    var viewers = document.getElementById("ibcc-viewers");
    var viewersHero = document.getElementById("ibcc-viewers-hero");
    var sold = document.getElementById("ibcc-sold");
    var soldCount = 150 + Math.floor(Math.random() * 90);
    var viewCount = 240 + Math.floor(Math.random() * 180);
    function setViewers() {
      viewCount += Math.floor(Math.random() * 21) - 10;
      if (viewCount < 180) viewCount = 180 + Math.floor(Math.random() * 30);
      if (viewCount > 520) viewCount = 520 - Math.floor(Math.random() * 30);
      if (viewers) viewers.textContent = viewCount;
      if (viewersHero) viewersHero.textContent = viewCount;
    }
    function bumpSold() {
      soldCount += Math.floor(Math.random() * 3) + 1;
      if (sold) sold.textContent = soldCount;
    }
    setViewers(); if (sold) sold.textContent = soldCount;
    setInterval(setViewers, 3200);
    setInterval(bumpSold, 9000);

    /* ----- social proof toast ----- */
    var toast = document.getElementById("ibcc-toast");
    var tName = document.getElementById("ibcc-toast-name");
    var tText = document.getElementById("ibcc-toast-text");
    var tImg = document.getElementById("ibcc-toast-img");
    var CITIES = ["London","Paris","New York","Seoul","Dubai","Sydney","Toronto","Berlin","Milan","Singapore","Los Angeles","Amsterdam","Madrid","Tokyo","Chicago","Boston","Vancouver","Melbourne","Barcelona","Hong Kong","Austin","Nashville","Portland","Montreal"];
    var actions = [
      "just grabbed the CC Cream",
      "bought the Buy 2 Get 1 bundle",
      "ordered 2 tubes (Light)",
      "ordered 2 tubes (Dark)",
      "just checked out — first time buyer",
      "repurchased (tube #3)",
      "added one for her sister too",
      "finally tried it after seeing reviews",
      "picked up the CC Cream + free shipping"
    ];
    if (tImg && CFG.productImg) tImg.src = CFG.productImg;
    function showToast() {
      if (!toast) return;
      tName.textContent = pick(NAMES).split(" ")[0] + " from " + pick(CITIES);
      tText.textContent = pick(actions) + " · " + (Math.floor(rng() * 25) + 2) + " min ago";
      toast.classList.add("is-visible");
      setTimeout(function () { toast.classList.remove("is-visible"); }, 5200);
    }
    setTimeout(function () {
      showToast();
      setInterval(showToast, 13000);
    }, 4500);
  });
})();
