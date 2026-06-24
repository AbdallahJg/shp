/* ============================================================
   AÉRIS — Climatiseur portable : interactions, avis, preuve sociale
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.IBCC || { rating: "4,8", reviewCount: 2847, reviewPhotos: [], productImg: "" };

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

  /* ---------- review content pools (FR, human-style) ---------- */
  var NAMES = [
    "Sophie M.","Nathalie R.","Camille G.","Sandrine L.","Isabelle F.","Chloé W.","Aurélie O.","Léa B.",
    "Stéphanie P.","Émilie S.","Christine V.","Valérie D.","Patricia H.","Sylvie A.","Caroline R.","Manon C.",
    "Élodie T.","Julie K.","Jessica B.","Nadia E.","Delphine V.","Sabrina N.","Laetitia M.","Audrey S.",
    "Marion C.","Céline W.","Karine L.","Anaïs D.","Mélanie M.","Pauline V.","Sarah R.","Amandine T.",
    "Virginie L.","Béatrice H.","Florence O.","Carole S.","Inès B.","Fanny F.","Maëva D.","Clara V.",
    "Didier L.","Michel P.","Christophe R.","Philippe D.","Olivier S.","Jean-Pierre M.","Thierry B.","Laurent C.",
    "Sébastien V.","Nicolas L.","Frédéric H.","Pascal G.","Alain R.","Patrick S.","Gérard D.","Bernard M.",
    "Vincent T.","Julien C.","Maxime L.","Antoine B.","Romain V.","Mathieu D.","Guillaume P.","David R.",
    "Fabrice S.","Bruno L.","Yannick H.","Cédric M.","Hervé D.","Jérôme C.","Stéphane B.","Damien V.",
    "Lucas T.","Théo L.","Hugo C.","Quentin B.","Adrien V.","Benjamin D.","Alexandre P.","Florian R.",
    "Martine S.","Monique L.","Françoise H.","Catherine M.","Brigitte D.","Jacqueline C.","Danielle B.","Chantal V.",
    "Annie T.","Josiane L.","Nicole C.","Yvette B.","Ginette V.","Colette D.","Huguette P.","Simone R.",
    "Fatima Z.","Karim B.","Mohamed A.","Yasmine K.","Samir L.","Leïla D.","Nadir C.","Amina B.",
    "Sofia V.","Marco L.","Elena T.","Paolo C.","Luca B.","Giulia V.","Andrea D.","Carmen P.",
    "Manuela R.","Ricardo S.","Joana L.","Pedro M.","Beatriz C.","Tiago B.","Ana V.","Rui D."
  ];

  var TITLES_5 = [
    "Un vrai climatiseur avec un verre d'eau","Petit mais costaud !","Efficace et silencieux","Parfait pour la canicule",
    "Rafraîchit la pièce très vite","Génial, je recommande","Le meilleur achat de l'été","Adieu les nuits étouffantes",
    "Surpris par son efficacité","Indispensable au bureau","Mieux qu'un ventilateur","Pas cher et redoutable",
    "Très satisfait de mon achat","Conforme à la description","Du bon matos !","Climatiseur efficace",
    "Clim mobile au top","Une brise fraîche immédiate","J'en ai commandé un deuxième","La fraîcheur partout",
    "Parfait avec des glaçons","Silencieux la nuit","Mes enfants adorent","Économique et écologique",
    "Idéal pour le télétravail","Compact et puissant","Sauvé pendant la canicule","Rien à dire, parfait",
    "Brumisation au top","Recharge USB-C pratique","Léger et nomade","Enfin une vraie solution chaleur",
    "Top pour la chambre","La terrasse au frais","Achat coup de cœur","Efficace même en plein soleil",
    "Discret et efficace","Refroidissement rapide garanti","Mon allié anti-chaleur","Bluffé par la fraîcheur"
  ];

  var TITLES_4 = [
    "Très bien, un petit bémol","Bon rafraîchisseur au quotidien","Presque parfait","Efficace avec des glaçons",
    "Très content dans l'ensemble","Bon produit","Bonne fraîcheur, format compact","Agréablement surpris",
    "Je recommande quand même","4,5 si je pouvais","Bien mais lisez les astuces","Mieux que prévu",
    "Parfait pour un espace perso","Réservoir un peu juste","Faut le placer près de soi","Top avec un peu d'eau froide",
    "Pas parfait mais très bon","Bon rapport qualité-prix","Mon indispensable du bureau","Efficace sans excès"
  ];

  var TITLES_3 = [
    "Correct mais zone perso","Bien, rafraîchit de près","Correct pour le prix","Efficace si on est proche",
    "Astuce glaçons obligatoire","Pas mal sans plus","Correct avec ajustements","À tester chez soi",
    "Avis mitigé mais je garde","Bien une fois bien placé","Moyen-bon"
  ];

  var SKIN = [
    "Chambre","Salon","Bureau","Télétravail","Cuisine","Terrasse","Véranda","Camping",
    "Bureau à domicile","Petit espace","Studio","Atelier","Caravane","Balcon","Salle de séjour"
  ];

  var SHADES = ["Blanc Givré","Bleu Glacier"];
  var AVATAR_COLORS = ["#38a7c4","#1c7e9c","#5bbcd6","#2e8fb0","#7fd2e3","#1f6f8c","#46a7c0","#3892ad","#69c4dc","#2a7d99"];

  /* avis complets (5 étoiles) — inspirés d'avis clients réels */
  var BODY_5_FULL = [
    "Petit mais costaud ! Et efficace aussi. Réservoir d'eau de 0,5 L, plein de glaçons, avec ventilateur et brumisateur donc de l'eau bien fraîche… franchement je suis très surpris de l'efficacité ! Autre avantage et non des moindres, la brumisation ne laisse pas d'eau ni d'humidité au sol. Assez silencieux en basse vitesse et pas trop bruyant. Ce n'est pas une climatisation coûteuse et technique, c'est 20 fois mieux qu'un ventilateur qui brasse l'air chaud. La solution pas chère et pas encombrante !",
    "Ce climatiseur refroidit très rapidement une salle de séjour de 25 m². Je suis content de l'avoir reçu avant les journées de canicule. L'entretien est apparemment très simple : il y a uniquement les 2 filtres à contrôler et à nettoyer à l'eau chaude en cas de besoin.",
    "Un vrai climatiseur avec un simple verre d'eau. Je n'y croyais pas et pourtant ça marche vraiment bien sur ma zone de bureau.",
    "Superbe, merci beaucoup. Efficace, pas trop bruyant, le refroidissement est super, rien à dire. Elle est géniale, je recommande à 100%.",
    "Je la recommande, elle est super comme clim. Elle ne fait pas trop de bruit et refroidit la pièce rapidement. Parfaite pour les chaudes journées d'été.",
    "Conforme à la description, je recommande vivement ce produit. Livraison rapide et il fait exactement ce qui est promis.",
    "Avec quelques glaçons dans le réservoir, l'effet est immédiat. Je l'ai sur mon bureau et je sens tout de suite la fraîcheur. La brumisation est très agréable et n'humidifie pas le sol.",
    "Parfait pour la chambre la nuit. En basse vitesse il est vraiment discret, on s'endort au frais sans le bruit d'une vraie clim. La batterie tient toute la nuit.",
    "Je télétravaille et c'était l'enfer avec la chaleur. Depuis que je l'ai posé à côté de mon clavier, je tiens la journée sans suer. Recharge en USB-C, super pratique.",
    "Acheté pour la canicule et je ne regrette pas une seconde. Il rafraîchit vite mon coin salon et la brume est très agréable sur le visage.",
    "Très bonne surprise. Je m'attendais à un gadget et en fait c'est efficace. Avec de l'eau bien froide et des glaçons, on a une vraie brise fraîche.",
    "Léger, sans fil, je l'emmène partout dans la maison. Le matin dans la cuisine, l'après-midi sur la terrasse. La dragonne est bien pratique.",
    "Silencieux, efficace et joli sur le bureau. Mes collègues m'ont demandé la référence. Pour le prix c'est imbattable face à une vraie climatisation.",
    "Je dors enfin correctement pendant les nuits chaudes. Réservoir rempli + quelques glaçons et c'est parti pour plusieurs heures de fraîcheur.",
    "Très bon produit, exactement comme décrit. La brumisation rafraîchit vraiment et il n'y a aucune humidité au sol, c'est ce qui m'inquiétait.",
    "Format compact, parfait pour mon studio. Il rafraîchit ma zone sans faire grimper la facture d'électricité comme le ferait une clim classique.",
    "Je l'utilise au bureau et à la maison. Deux vitesses, deux niveaux de brume, on règle comme on veut. Vraiment content de cet achat.",
    "Mon mari était sceptique, maintenant c'est lui qui se le pique. On va devoir en commander un deuxième pour éviter les disputes !",
    "Efficace même en plein cagnard sur mon balcon. Bien sûr ce n'est pas une clim de toute la maison, mais pour rester au frais à un endroit précis c'est top.",
    "La recharge USB-C est un vrai plus, je le branche sur la batterie externe en extérieur. Autonomie correcte, environ une demi-journée sans glaçons.",
    "Reçu rapidement, très bien emballé. Dès le premier jour de chaleur il a fait ses preuves. La brume est fine et fraîche, aucun dégât au sol.",
    "Idéal pour ma fille qui a du mal à dormir quand il fait chaud. Mode silencieux activé, brume douce, elle s'endort sans problème maintenant.",
    "J'ai ajouté quelques gouttes d'huile essentielle de lavande et la chambre sent divinement bon en plus d'être fraîche. Double effet appréciable.",
    "Excellent rapport qualité-prix. Pas besoin d'installer quoi que ce soit, on remplit, on allume, et la fraîcheur arrive. Simple et efficace.",
    "Je l'emmène au camping, branché sur une batterie nomade. Le soir sous la tente ça change la vie. Compact et vraiment pratique à transporter.",
    "Très satisfaite. Il rafraîchit bien ma zone de travail et l'air n'est pas sec comme avec un ventilateur classique. Ma gorge ne pique plus le matin.",
    "Petit appareil mais grande efficacité. Sur mon bureau, en vitesse 2 avec des glaçons, je sens une vraie différence en quelques minutes.",
    "Parfait pour les bouffées de chaleur. Je le garde près de moi au salon le soir, brume légère, et je suis bien. Discret et efficace.",
    "Acheté pour mes parents âgés pendant la canicule. Très simple d'utilisation pour eux, ils l'adorent et dorment beaucoup mieux.",
    "Le filtre intégré est un bon point, l'air semble plus propre. Entretien facile, on rince et c'est reparti. Je recommande vraiment.",
    "Franchement bluffé. Pour un si petit appareil, la fraîcheur dégagée est surprenante. Avec de l'eau glacée c'est encore mieux.",
    "Je l'utilise tous les jours depuis le début de l'été. Aucune panne, toujours aussi efficace. La brumisation ultrasonique fait vraiment le job.",
    "Top pour la voiture en stationnement et la caravane. Sans fil, on le pose où on veut. La dragonne permet même de l'accrocher.",
    "Rafraîchit vite et bien mon coin bureau. Le bruit est très acceptable, je passe des appels sans souci en basse vitesse.",
    "Cadeau pour ma sœur qui m'a remerciée dix fois. Elle l'utilise dans sa cuisine quand elle cuisine en plein été. Efficace et joli.",
    "Rien à redire, il fait exactement ce qui est annoncé. Brise fraîche, brume agréable, pas d'humidité au sol, recharge USB-C. Parfait.",
    "Je le recommande les yeux fermés. Pour le prix d'un bon ventilateur on a en plus la brumisation et l'humidification. Aucun regret.",
    "Très bonne autonomie pour mon usage. Je le recharge une fois par jour et il tient mes heures de travail au frais. Silencieux et efficace.",
    "La brume est vraiment fine et rafraîchissante, on la sent sur la peau sans être mouillé. Gros plus comparé aux brumisateurs basiques.",
    "Parfait pour un espace personnel. Je ne cherchais pas à climatiser toute la maison, juste mon coin, et là c'est mission accomplie.",
    "Reçu avant la vague de chaleur, quel soulagement. Refroidissement rapide, plusieurs réglages, et il ne consomme presque rien. Top achat.",
    "Mon ado l'a adopté dans sa chambre pour réviser au frais. Silencieux, efficace, et il aime bien mettre une goutte d'huile essentielle dedans.",
    "Solide et bien fini pour le prix. La fraîcheur est immédiate avec des glaçons. Je le rebranche en USB-C la nuit et il est prêt le matin.",
    "Excellent pour les petites pièces. Dans mon bureau fermé, il rafraîchit nettement l'ambiance en peu de temps. Très content."
  ];

  var BODY_4_FULL = [
    "Très bon petit appareil. Il rafraîchit bien si on reste à proximité, c'est un rafraîchisseur personnel après tout, pas une clim de salon. Avec des glaçons c'est nettement mieux. Une étoile en moins car le réservoir se vide assez vite en vitesse maxi.",
    "Efficace et silencieux en basse vitesse. En vitesse 2 il fait un peu plus de bruit mais reste supportable. Bonne fraîcheur sur ma zone de bureau, je recommande.",
    "Bonne surprise pour le prix. La brumisation fonctionne bien et n'humidifie pas le sol. Je retire une étoile car j'aurais aimé une autonomie un peu plus longue sans recharge.",
    "Parfait pour mon bureau, un peu juste pour une grande pièce. Si on le place près de soi c'est très agréable. Astuce : mettre de l'eau bien froide et des glaçons.",
    "Très content dans l'ensemble. Compact, léger, recharge USB-C pratique. Le réservoir de 500 ml est correct mais je dois le remplir une à deux fois par jour en usage intensif.",
    "Bon rafraîchisseur au quotidien. La brume est agréable, le ventilateur efficace. Je mets 4 étoiles car le mode rapide est un peu bruyant pour la nuit, mais en mode doux c'est parfait.",
    "Fait le travail sur un espace personnel. Avec glaçons l'effet clim est bien là. Sans glaçons ça reste un bon ventilateur brumisant. Bon produit pour le prix.",
    "Je l'utilise au télétravail, très bien pour garder la tête froide. La batterie tient ma matinée, je le recharge à midi. Petit bémol sur la capacité du réservoir.",
    "Agréablement surpris par la fraîcheur dégagée. Pour une chambre il faut le mettre près du lit. Silencieux en mode doux, je dors bien. Je recommande avec ces réserves.",
    "Bon produit, conforme. La brumisation ultrasonique est vraiment fine. Je retire une étoile car la notice est un peu sommaire, mais l'utilisation reste intuitive.",
    "Très pratique et nomade. Je le déplace de pièce en pièce facilement. Efficace en usage rapproché, un peu moins si on s'éloigne. Honnête pour le tarif.",
    "Rafraîchit bien mon coin salon le soir. J'ajoute des glaçons et c'est top. Le seul point : penser à le recharger régulièrement. Sinon très satisfait.",
    "Idéal en appoint personnel. Ne vous attendez pas à climatiser 30 m², mais pour rester au frais à votre poste c'est parfait. Silencieux et économe.",
    "Bonne fraîcheur, format compact, recharge USB-C. Quatre étoiles car le réservoir pourrait être plus grand. Avec de l'eau glacée il fait vraiment le job.",
    "Efficace avec des glaçons, comme indiqué dans les astuces. Sans, c'est un bon brumisateur ventilé. Pour un usage de bureau c'est exactement ce qu'il me fallait.",
    "Très bien pour la chambre de mon fils. Mode doux silencieux. Je mets 4 étoiles seulement parce qu'il faut le remplir souvent quand il fait très chaud.",
    "Petit, malin, efficace de près. La brume rafraîchit sans mouiller. J'aurais aimé une télécommande avec plus de portée mais dans l'ensemble je suis content.",
    "Bon rapport qualité-prix. Parfait pour une utilisation personnelle au bureau ou en chambre. Une étoile en moins pour l'autonomie en pleine puissance."
  ];

  var BODY_3_FULL = [
    "Correct mais c'est vraiment un rafraîchisseur personnel : il faut être tout près pour sentir la fraîcheur. Avec des glaçons c'est mieux. Ne vous attendez pas à climatiser une grande pièce.",
    "Pas mal pour le prix. La brumisation fonctionne mais le réservoir se vide assez vite. Bien pour un coin bureau, moins pour un salon entier.",
    "Efficace si on est proche, sinon on ne sent pas grand-chose. C'est honnête pour ce que c'est, mais il faut bien comprendre que c'est un appareil de zone personnelle.",
    "Ça rafraîchit un peu, surtout avec de l'eau bien froide et des glaçons. Sans ça, ça reste un ventilateur un peu humide. Correct sans être bluffant.",
    "Bien mais l'autonomie est juste en pleine puissance. Je dois le recharger souvent. Pour un usage posé sur le bureau toute la journée c'est limite.",
    "Trois étoiles : utile en appoint personnel mais ne remplace pas une climatisation. Avec glaçons l'effet est correct sur une petite zone.",
    "Produit moyen-bon. La brume est agréable, le refroidissement réel mais localisé. Faut gérer ses attentes : c'est un rafraîchisseur, pas un climatiseur de pièce.",
    "Correct. Silencieux en mode doux, plus bruyant en mode rapide. Efficace de près. J'aurais aimé un réservoir plus grand pour tenir plus longtemps."
  ];

  /* fragments pour avis assemblés */
  var HOOKS = [
    "Honnêtement,","Soyons clairs —","Je l'ai depuis {weeks} semaines maintenant,","En toute transparence :","Mise à jour après {weeks} semaines :",
    "Je laisse rarement des avis mais","Ma sœur m'a fait essayer et","Acheté sur un coup de tête et","J'étais prêt à le renvoyer et",
    "Avec un usage en {skin},","Pour la canicule,","Petit avis rapide :","Reçu juste avant les fortes chaleurs,",
    "Vu partout sur mon fil et j'ai craqué.","Entre le bureau et la maison,","J'en suis déjà à un usage quotidien donc","Première impression mitigée. Quelques jours après ? Tout autre chose.",
    "Pas du genre à m'emballer mais","Mon collègue m'a demandé la référence,","Posé sur mon bureau,","Testé en {skin} pendant la vague de chaleur,"
  ];

  var WINS = [
    "il rafraîchit vraiment vite ma zone de travail.",
    "la brume est fraîche et ne laisse aucune humidité au sol.",
    "en basse vitesse il est super silencieux.",
    "avec des glaçons l'effet clim est immédiat.",
    "la recharge USB-C est ultra pratique.",
    "il est léger, je le déplace de pièce en pièce sans effort.",
    "l'air n'est pas sec comme avec un ventilateur classique.",
    "il rafraîchit sans faire exploser la facture d'électricité.",
    "mode doux la nuit, je dors enfin au frais.",
    "les collègues m'ont tous demandé où je l'avais acheté.",
    "la brume est fine, on la sent sur la peau sans être mouillé.",
    "il a tenu toute une après-midi de canicule.",
    "avec une goutte d'huile essentielle, la pièce sent bon en plus.",
    "le filtre rend l'air plus agréable à respirer.",
    "le réservoir de 500 ml me fait plusieurs heures.",
    "il remplace mon vieux ventilateur bruyant.",
    "parfait pour mon coin bureau en télétravail.",
    "deux vitesses et deux niveaux de brume, on règle comme on veut.",
    "compact, il se range et se transporte facilement.",
    "la dragonne est pratique pour l'emmener en extérieur."
  ];

  var BUTS = [
    "Seul bémol : pensez à le placer près de vous.",
    "Il faut le remplir une à deux fois par jour en pleine chaleur.",
    "L'autonomie est un peu juste en vitesse maximale.",
    "Le mode rapide est un peu plus bruyant.",
    "J'aurais aimé un réservoir un peu plus grand.",
    "Avec glaçons c'est nettement mieux que sans.",
    "Ce n'est pas une clim de toute la pièce, mais un appoint perso.",
    "La télécommande a une portée limitée.",
    "Il faut bien comprendre que c'est un rafraîchisseur personnel.",
    "Recharge à prévoir régulièrement si usage intensif."
  ];

  var CLOSERS = [
    "J'en commande un deuxième.","Je rachèterais sans hésiter.","Je le recommande à tout le monde.",
    "Si vous hésitez, foncez.","Bien mieux qu'un simple ventilateur.","Mon indispensable de l'été.",
    "Aucun regret.","Le rapport qualité-prix est imbattable.","La fraîcheur sans la facture salée.",
    "10/10 pour les nuits chaudes.","Offert à ma mère, elle adore.","Je le rebranche chaque soir.",
    "Je ne pensais pas être autant convaincu.","Simple, efficace, parfait."
  ];

  var SHORT_5 = [
    "Efficace et silencieux. Parfait.","Bluffé. J'en reprends un.","Un vrai climatiseur avec un verre d'eau.",
    "Remplace mon vieux ventilateur.","Rien à dire, top.","Frais, discret, nomade. J'adore.",
    "Meilleur achat de l'été.","Refroidit vite ma pièce.","Brumisation au top.",
    "Posé sur le bureau, je tiens la journée.","Maman me l'a piqué. J'en recommande un.","Adieu les nuits étouffantes.",
    "Pas cher et redoutable.","Conforme et efficace.","Avec glaçons : effet clim immédiat.",
    "Silencieux la nuit, parfait.","Canicule passée sans souffrir.","Recharge USB-C, super pratique.",
    "Brume fraîche, zéro humidité au sol.","Compact et puissant. Validé.","Du bon matos !",
    "Clim mobile au top.","Idéal en télétravail.","Léger, je l'emmène partout."
  ];

  var SHORT_4 = [
    "Très bien, à placer près de soi.","Top avec des glaçons.",
    "4 étoiles, je recommande.","Presque parfait. Je rachète quand même.",
    "Bon en perso, pas pour 30 m².","Solide. Réservoir un peu juste.",
    "Efficace, à recharger souvent.","Léger bruit en vitesse maxi. Bon sinon.",
    "Bon rapport qualité-prix.","Très correct au bureau."
  ];

  var SHORT_3 = [
    "Correct, faut être proche.","Bien sans plus.","Pas mal, glaçons conseillés.",
    "3 étoiles, appoint perso.","Rafraîchit une petite zone.","Bien si on gère ses attentes.",
    "Réservoir se vide vite.","À tester, ça dépend de la pièce."
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
    parts.push(pick(WINS));
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

  var MONTHS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  function randomDate() {
    var now = new Date();
    var past = new Date(now.getTime() - Math.floor(rng() * 540 + 4) * 86400000);
    return past.getDate() + " " + MONTHS[past.getMonth()] + " " + past.getFullYear();
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
        helpful: Math.floor(rng() * 90)
      });
    }
    return out;
  }
  var REVIEWS = buildReviews(540);

  function starHTML(n) {
    return '<span class="ibcc-stars">' + "★★★★★".slice(0, n) + '<span style="opacity:.25">' + "★★★★★".slice(n) + "</span></span>";
  }
  function reviewHTML(rv) {
    var photo = rv.photo ? '<div class="ibcc-review__photo"><img loading="lazy" src="' + rv.photo + '" alt="Photo client de ' + rv.name + '"></div>' : "";
    var helpful = rv.helpful > 1 ? '<div class="ibcc-review__helpful">👍 ' + rv.helpful + ' personnes ont trouvé cet avis utile</div>' : "";
    return '<article class="ibcc-review">' +
      '<div class="ibcc-review__top">' +
        '<span class="ibcc-avatar" style="background:' + rv.color + '">' + rv.initial + '</span>' +
        '<div class="ibcc-review__who"><b>' + rv.name + '</b>' +
          '<span class="verified">✓ Achat vérifié · ' + rv.skin + '</span></div>' +
      '</div>' +
      starHTML(rv.rating) +
      '<div class="ibcc-review__title">' + rv.title + '</div>' +
      '<p class="ibcc-review__text">' + rv.body + '</p>' +
      photo +
      '<div class="ibcc-review__date">Coloris ' + rv.shade + ' · ' + rv.date + '</div>' +
      helpful +
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
        if (target >= 10000) return Math.round(v).toLocaleString("fr-FR");
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

    /* ----- color selector ----- */
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
        msg.textContent = "✓ C'est noté ! Votre code -10% arrive dans votre boîte mail.";
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
      if (cursor >= current.length) loading.textContent = "Vous avez tout lu — merci de votre lecture !";
      else loading.textContent = "Chargement d'autres avis…";
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
    var CITIES = ["Paris","Lyon","Marseille","Toulouse","Bordeaux","Lille","Nantes","Nice","Strasbourg","Montpellier","Rennes","Grenoble","Toulon","Dijon","Angers","Le Havre","Reims","Aix-en-Provence","Clermont-Ferrand","Bruxelles","Genève","Lausanne","Montréal","Annecy"];
    var actions = [
      "vient de commander le climatiseur",
      "a profité de l'offre 2 achetés = 1 offert",
      "a commandé 2 climatiseurs (Blanc Givré)",
      "a commandé 2 climatiseurs (Bleu Glacier)",
      "vient de finaliser sa commande",
      "a recommandé un deuxième exemplaire",
      "en a ajouté un pour sa sœur",
      "a craqué après avoir lu les avis",
      "a commandé le climatiseur + livraison offerte"
    ];
    if (tImg && CFG.productImg) tImg.src = CFG.productImg;
    function showToast() {
      if (!toast) return;
      tName.textContent = pick(NAMES).split(" ")[0] + " de " + pick(CITIES);
      tText.textContent = pick(actions) + " · il y a " + (Math.floor(rng() * 25) + 2) + " min";
      toast.classList.add("is-visible");
      setTimeout(function () { toast.classList.remove("is-visible"); }, 5200);
    }
    setTimeout(function () {
      showToast();
      setInterval(showToast, 13000);
    }, 4500);
  });
})();
