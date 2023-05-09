import type {Document} from '#/documents'

export const _document: Document = {
    id: 1,
    name: 'Charte Site Alsace',
    acronym: 'CHARTE_SITE_ALSACE',
    description: 'Charte signée par le président d\'une association Site Alsace',
    contact: 'https://svu.unistra.fr/vie-des-campus/vie-universitaire/soutien-aux-associations-etudiantes/agrement-association-etudiante-du-site-alsace',
    isMultiple: false,
    isRequiredInProcess: false,
    daysBeforeExpiration: '365 00:00:00',
    pathTemplate: null,
    mimeTypes: [
        'application/pdf'
    ],
    processType: 'CHARTER_ASSOCIATION',
    institution: null,
    commission: null
}

export const _documents: Document[] = [
    {
        id: 1,
        name: 'Charte Site Alsace',
        acronym: 'CHARTE_SITE_ALSACE',
        description: 'Charte signée par le président d\'une association Site Alsace',
        contact: 'https://svu.unistra.fr/vie-des-campus/vie-universitaire/soutien-aux-associations-etudiantes/agrement-association-etudiante-du-site-alsace',
        isMultiple: false,
        isRequiredInProcess: false,
        daysBeforeExpiration: '365 00:00:00',
        pathTemplate: null,
        mimeTypes: [
            'application/pdf'
        ],
        processType: 'CHARTER_ASSOCIATION',
        institution: null,
        commission: null
    },
    {
        id: 2,
        name: 'RGPD Site Alsace',
        acronym: 'RGPD_SITE_ALSACE',
        description: 'Charte RGPD signée par le président d\'une association Site Alsace',
        contact: 'https://svu.unistra.fr/vie-des-campus/vie-universitaire/soutien-aux-associations-etudiantes/agrement-association-etudiante-du-site-alsace',
        isMultiple: false,
        isRequiredInProcess: false,
        daysBeforeExpiration: '365 00:00:00',
        pathTemplate: null,
        mimeTypes: [
            'application/pdf',
            'image/jpeg',
            'image/png'
        ],
        processType: 'CHARTER_ASSOCIATION',
        institution: null,
        commission: null
    },
    {
        id: 3,
        name: 'Charte FSDIE',
        acronym: 'CHARTE_FSDIE',
        description: 'Charte Fonds de Solidarité et de Développement des Initiatives Étudiantes',
        contact: 'https://svu.unistra.fr/vie-des-campus/vie-universitaire/soutien-aux-associations-etudiantes/agrement-association-etudiante-du-site-alsace',
        isMultiple: false,
        isRequiredInProcess: false,
        daysBeforeExpiration: '365 00:00:00',
        pathTemplate: null,
        mimeTypes: [
            'application/pdf'
        ],
        processType: 'CHARTER_PROJECT_COMMISSION',
        institution: null,
        commission: 1
    }
]

export const _processDocuments = [
    {
        id: 1,
        document: 10,
        isMultiple: true,
        description: 'Document 10',
        pathFile: ['PathFile Document 10 1/2', 'PathFile Document 10 2/2'],
        isRequiredInProcess: false,
        mimeTypes: [
            'application/pdf'
        ]
    },
    {
        id: 2,
        document: 11,
        isMultiple: false,
        description: 'Document 11',
        pathFile: ['PathFile Document 11'],
        isRequiredInProcess: true,
        mimeTypes: [
            'application/pdf'
        ]
    }
]