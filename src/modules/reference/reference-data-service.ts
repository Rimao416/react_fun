
import { redis } from '@config/redis';

export class ReferenceDataService {
  // Cache duration: 24 heures
  private CACHE_TTL = 86400;

  // Catégories Services Locaux
  async getLocalServiceCategories() {
    const cached = await redis.get('ref:local_categories');
    if (cached) return JSON.parse(cached);

    const categories = [
      {
        id: 'cleaning',
        name: '🧹 Ménage & Nettoyage',
        description: 'Nettoyage de maisons, bureaux, vitres',
        skills: [
          { id: 'home_cleaning', name: 'Ménage résidentiel' },
          { id: 'office_cleaning', name: 'Nettoyage de bureaux' },
          { id: 'window_cleaning', name: 'Nettoyage de vitres' },
          { id: 'deep_cleaning', name: 'Nettoyage en profondeur' },
          { id: 'laundry', name: 'Lessive et repassage' },
        ],
      },
      {
        id: 'cooking',
        name: '👨‍🍳 Cuisine & Traiteur',
        description: 'Préparation de repas, événements',
        skills: [
          { id: 'home_cooking', name: 'Cuisine à domicile' },
          { id: 'catering', name: 'Traiteur événements' },
          { id: 'traditional_food', name: 'Cuisine traditionnelle' },
          { id: 'pastry', name: 'Pâtisserie' },
          { id: 'meal_prep', name: 'Préparation repas semaine' },
        ],
      },
      {
        id: 'delivery',
        name: '🚚 Livraison & Transport',
        description: 'Courses, colis, transport personnes',
        skills: [
          { id: 'food_delivery', name: 'Livraison repas' },
          { id: 'package_delivery', name: 'Livraison colis' },
          { id: 'grocery_shopping', name: 'Courses à domicile' },
          { id: 'taxi', name: 'Transport de personnes' },
          { id: 'moto_taxi', name: 'Moto-taxi' },
        ],
      },
      {
        id: 'childcare',
        name: '👶 Garde d\'enfants',
        description: 'Baby-sitting, aide aux devoirs',
        skills: [
          { id: 'babysitting', name: 'Garde d\'enfants' },
          { id: 'homework_help', name: 'Aide aux devoirs' },
          { id: 'tutoring', name: 'Soutien scolaire' },
          { id: 'daycare', name: 'Garde journée complète' },
        ],
      },
      {
        id: 'gardening',
        name: '🌱 Jardinage & Extérieur',
        description: 'Entretien jardins, espaces verts',
        skills: [
          { id: 'lawn_mowing', name: 'Tonte de pelouse' },
          { id: 'tree_trimming', name: 'Taille d\'arbres' },
          { id: 'planting', name: 'Plantation' },
          { id: 'garden_maintenance', name: 'Entretien jardin' },
        ],
      },
      {
        id: 'repairs',
        name: '🔧 Petites réparations',
        description: 'Plomberie, électricité, bricolage',
        skills: [
          { id: 'plumbing', name: 'Plomberie' },
          { id: 'electrical', name: 'Électricité' },
          { id: 'painting', name: 'Peinture' },
          { id: 'carpentry', name: 'Menuiserie' },
          { id: 'handyman', name: 'Bricolage général' },
        ],
      },
      {
        id: 'moving',
        name: '📦 Manutention & Déménagement',
        description: 'Aide déménagement, transport meubles',
        skills: [
          { id: 'moving', name: 'Déménagement' },
          { id: 'furniture_assembly', name: 'Montage de meubles' },
          { id: 'heavy_lifting', name: 'Manutention lourde' },
          { id: 'packing', name: 'Emballage' },
        ],
      },
    ];

    await redis.setEx('ref:local_categories', this.CACHE_TTL, JSON.stringify(categories));
    return categories;
  }

  // Catégories Services Digitaux
  async getDigitalServiceCategories() {
    const cached = await redis.get('ref:digital_categories');
    if (cached) return JSON.parse(cached);

    const categories = [
      {
        id: 'design',
        name: '🎨 Design & Création',
        description: 'Graphisme, logos, illustrations',
        skills: [
          { id: 'logo_design', name: 'Création de logos' },
          { id: 'graphic_design', name: 'Design graphique' },
          { id: 'illustration', name: 'Illustration' },
          { id: 'ui_ux', name: 'UI/UX Design' },
          { id: 'photo_editing', name: 'Retouche photo' },
          { id: 'video_editing', name: 'Montage vidéo' },
        ],
      },
      {
        id: 'writing',
        name: '✍️ Rédaction & Traduction',
        description: 'Articles, traduction, contenu',
        skills: [
          { id: 'content_writing', name: 'Rédaction de contenu' },
          { id: 'copywriting', name: 'Copywriting' },
          { id: 'translation', name: 'Traduction' },
          { id: 'proofreading', name: 'Correction' },
          { id: 'seo_writing', name: 'Rédaction SEO' },
        ],
      },
      {
        id: 'development',
        name: '💻 Développement & Tech',
        description: 'Sites web, apps, programmation',
        skills: [
          { id: 'web_dev', name: 'Développement web' },
          { id: 'mobile_dev', name: 'Développement mobile' },
          { id: 'wordpress', name: 'WordPress' },
          { id: 'shopify', name: 'Shopify' },
          { id: 'database', name: 'Base de données' },
          { id: 'api', name: 'API Development' },
        ],
      },
      {
        id: 'marketing',
        name: '📱 Marketing & Réseaux Sociaux',
        description: 'Social media, publicité, community',
        skills: [
          { id: 'social_media', name: 'Gestion réseaux sociaux' },
          { id: 'facebook_ads', name: 'Facebook Ads' },
          { id: 'instagram_growth', name: 'Croissance Instagram' },
          { id: 'community_management', name: 'Community management' },
          { id: 'email_marketing', name: 'Email marketing' },
        ],
      },
      {
        id: 'data_entry',
        name: '📊 Saisie de Données & Admin',
        description: 'Data entry, Excel, assistanat',
        skills: [
          { id: 'data_entry', name: 'Saisie de données' },
          { id: 'excel', name: 'Excel avancé' },
          { id: 'virtual_assistant', name: 'Assistant virtuel' },
          { id: 'research', name: 'Recherche web' },
          { id: 'transcription', name: 'Transcription' },
        ],
      },
      {
        id: 'teaching',
        name: '🎓 Enseignement & Formation',
        description: 'Cours en ligne, tutorat',
        skills: [
          { id: 'online_tutoring', name: 'Tutorat en ligne' },
          { id: 'course_creation', name: 'Création de cours' },
          { id: 'language_teaching', name: 'Enseignement langues' },
          { id: 'music_lessons', name: 'Cours de musique' },
        ],
      },
    ];

    await redis.setEx('ref:digital_categories', this.CACHE_TTL, JSON.stringify(categories));
    return categories;
  }

  // Langues disponibles
  async getLanguages() {
    const cached = await redis.get('ref:languages');
    if (cached) return JSON.parse(cached);

    const languages = [
      // Langues internationales
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      
      // Langues africaines
      { code: 'wo', name: 'Wolof', flag: '🇸🇳', region: 'West Africa' },
      { code: 'bm', name: 'Bambara', flag: '🇲🇱', region: 'West Africa' },
      { code: 'ff', name: 'Pulaar/Fulfulde', flag: '🌍', region: 'West Africa' },
      { code: 'dyu', name: 'Dioula', flag: '🇨🇮', region: 'West Africa' },
      { code: 'ha', name: 'Hausa', flag: '🇳🇬', region: 'West Africa' },
      { code: 'yo', name: 'Yoruba', flag: '🇳🇬', region: 'West Africa' },
      { code: 'ig', name: 'Igbo', flag: '🇳🇬', region: 'West Africa' },
      { code: 'sw', name: 'Swahili', flag: '🇰🇪', region: 'East Africa' },
      { code: 'am', name: 'Amharic', flag: '🇪🇹', region: 'East Africa' },
      { code: 'zu', name: 'Zulu', flag: '🇿🇦', region: 'Southern Africa' },
      { code: 'xh', name: 'Xhosa', flag: '🇿🇦', region: 'Southern Africa' },
    ];

    await redis.setEx('ref:languages', this.CACHE_TTL, JSON.stringify(languages));
    return languages;
  }

  // Pays africains
 async getCountries() {
    const cached = await redis.get('ref:countries');
    if (cached) return JSON.parse(cached);

    const countries = [
      {
        code: 'CI',
        name: 'Côte d\'Ivoire',
        flag: '🇨🇮',
        region: 'West',
        cities: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'Daloa', 'San-Pédro', 'Korhogo']
      },
      {
        code: 'CD',
        name: 'RD Congo',
        flag: '🇨🇩',
        region: 'Central',
        cities: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kananga', 'Kisangani', 'Goma']
      },
      {
        code: 'CM',
        name: 'Cameroun',
        flag: '🇨🇲',
        region: 'Central',
        cities: ['Yaoundé', 'Douala', 'Garoua', 'Bafoussam', 'Bamenda', 'Maroua']
      },
      {
        code: 'BJ',
        name: 'Bénin',
        flag: '🇧🇯',
        region: 'West',
        cities: ['Cotonou', 'Porto-Novo', 'Parakou', 'Djougou', 'Bohicon', 'Abomey']
      },
      {
        code: 'TG',
        name: 'Togo',
        flag: '🇹🇬',
        region: 'West',
        cities: ['Lomé', 'Sokodé', 'Kara', 'Atakpamé', 'Kpalimé', 'Dapaong']
      },
    ];

    await redis.setEx('ref:countries', this.CACHE_TTL, JSON.stringify(countries));
    return countries;
  }

  // Clear cache
  async clearCache() {
    await redis.del('ref:local_categories');
    await redis.del('ref:digital_categories');
    await redis.del('ref:languages');
    await redis.del('ref:countries');
    return { message: 'Cache cleared' };
  }
}
