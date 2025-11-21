import { PrismaClient, MissionType, MissionStatus, ExperienceLevel } from '../../../src/generated/prisma';
import { logSuccess } from '../utils/helpers';

export async function seedMissions(prisma: PrismaClient, clients: any[], freelancers: any[]) {
  const missionsData = [
    // Mission 1: Service Local - Nettoyage (PUBLISHED)
    {
      clientId: clients[0].id, // Mamadou Diop
      title: 'Nettoyage complet bureaux et vitres',
      description: 'Recherche personne sérieuse pour nettoyage hebdomadaire de nos bureaux (150m²). Inclut vitres, sols, sanitaires. Produits fournis.',
      missionType: MissionType.LOCAL_SERVICE,
      category: 'cleaning',
      budget: 45000, // 45,000 FCFA
      currency: 'XOF',
      isRecurring: true,
      recurringDetails: { frequency: 'weekly', duration: '6 months' },
      estimatedDuration: 4,
      isLocal: true,
      location: 'Plateau, Dakar',
      address: 'Avenue Léopold Sédar Senghor',
      maxDistance: 10,
      requiredSkills: ['Nettoyage professionnel', 'Ponctualité', 'Discrétion'],
      experienceLevel: ExperienceLevel.EXPERIENCED,
      startDate: new Date('2025-01-15'),
      preferredSchedule: { days: ['lundi', 'mercredi'], hours: '08h-12h' },
      status: MissionStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    
    // Mission 2: Service Local - Cuisine (PUBLISHED)
    {
      clientId: clients[1].id, // Restaurant Teranga
      title: 'Cuisinière pour événements traiteur',
      description: 'Restaurant cherche cuisinière expérimentée pour événements traiteur. Spécialités sénégalaises requises. Plusieurs missions par mois.',
      missionType: MissionType.LOCAL_SERVICE,
      category: 'cooking',
      budget: 75000,
      currency: 'XOF',
      isRecurring: false,
      estimatedDuration: 8,
      isLocal: true,
      location: 'Dakar Plateau',
      maxDistance: 15,
      requiredSkills: ['Cuisine sénégalaise', 'Traiteur', 'Hygiène HACCP'],
      experienceLevel: ExperienceLevel.EXPERT,
      startDate: new Date('2025-01-20'),
      deadline: new Date('2025-01-18'),
      status: MissionStatus.PUBLISHED,
      publishedAt: new Date(),
    },

    // Mission 3: Service Digital - Design (IN_PROGRESS)
    {
      clientId: clients[2].id, // Afritech Solutions
      title: 'Refonte complète identité visuelle startup',
      description: 'Recherche designer créatif pour refonte complète : logo, charte graphique, templates réseaux sociaux, site web.',
      missionType: MissionType.DIGITAL_SERVICE,
      category: 'graphic-design',
      budget: 350000,
      currency: 'XOF',
      isRecurring: false,
      estimatedDuration: 30,
      isLocal: false,
      requiredSkills: ['Adobe Illustrator', 'Photoshop', 'Branding', 'UI/UX'],
      experienceLevel: ExperienceLevel.EXPERT,
      deadline: new Date('2025-02-15'),
      status: MissionStatus.IN_PROGRESS,
      publishedAt: new Date('2024-12-15'),
    },

    // Mission 4: Service Digital - Développement (PUBLISHED)
    {
      clientId: clients[2].id, // Afritech Solutions
      title: 'Développeur React pour application mobile',
      description: 'Développement application mobile React Native pour gestion de stock. API REST existante à intégrer.',
      missionType: MissionType.DIGITAL_SERVICE,
      category: 'web-development',
      budget: 800000,
      currency: 'XOF',
      isRecurring: false,
      estimatedDuration: 60,
      isLocal: false,
      requiredSkills: ['React Native', 'JavaScript', 'API REST', 'Git'],
      experienceLevel: ExperienceLevel.EXPERIENCED,
      deadline: new Date('2025-03-01'),
      status: MissionStatus.PUBLISHED,
      publishedAt: new Date(),
    },

    // Mission 5: Service Local - Livraison (COMPLETED)
    {
      clientId: clients[1].id, // Restaurant Teranga
      title: 'Livreur moto pour service quotidien',
      description: 'Livreur avec moto pour livraisons restaurant. Zone Dakar et banlieue.',
      missionType: MissionType.LOCAL_SERVICE,
      category: 'delivery',
      budget: 5000,
      currency: 'XOF',
      isRecurring: true,
      recurringDetails: { frequency: 'daily', duration: '3 months' },
      estimatedDuration: 6,
      isLocal: true,
      location: 'Dakar',
      maxDistance: 50,
      requiredSkills: ['Moto', 'Connaissance Dakar', 'Ponctualité'],
      experienceLevel: ExperienceLevel.EXPERIENCED,
      status: MissionStatus.COMPLETED,
      publishedAt: new Date('2024-12-01'),
    },

    // Mission 6: Service Digital - Rédaction (PUBLISHED)
    {
      clientId: clients[3].id, // ONG
      title: 'Rédacteur pour articles blog et rapports',
      description: 'Rédaction d\'articles blog mensuels et traduction rapports français-anglais.',
      missionType: MissionType.DIGITAL_SERVICE,
      category: 'writing',
      budget: 150000,
      currency: 'XOF',
      isRecurring: true,
      recurringDetails: { frequency: 'monthly', articles: 4 },
      estimatedDuration: 20,
      isLocal: false,
      requiredSkills: ['Rédaction web', 'SEO', 'Traduction FR-EN'],
      experienceLevel: ExperienceLevel.EXPERIENCED,
      status: MissionStatus.PUBLISHED,
      publishedAt: new Date(),
    },

    // Mission 7: Service Local - Photographie (VALIDATED)
    {
      clientId: clients[0].id, // Mamadou
      title: 'Photographe pour événement corporate',
      description: 'Couverture photo et vidéo événement entreprise (100 personnes). Livraison retouchée sous 48h.',
      missionType: MissionType.LOCAL_SERVICE,
      category: 'photography',
      budget: 120000,
      currency: 'XOF',
      isRecurring: false,
      estimatedDuration: 8,
      isLocal: true,
      location: 'Almadies, Dakar',
      requiredSkills: ['Photographie événementielle', 'Retouche', 'Vidéo'],
      experienceLevel: ExperienceLevel.EXPERT,
      status: MissionStatus.VALIDATED,
      publishedAt: new Date('2024-11-20'),
    },
  ];

  const missions = await Promise.all(
    missionsData.map((data) =>
      prisma.mission.create({
        data: {
          ...data,
          viewsCount: Math.floor(Math.random() * 100) + 10,
          proposalsCount: 0, // Sera mis à jour avec les proposals
        },
      })
    )
  );

  logSuccess(`${missions.length} missions créées`);
  return missions;
}
