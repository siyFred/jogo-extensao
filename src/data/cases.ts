import type {
  TravelerCase,
  Document,
  DocumentField,
  Discrepancy,
  CaseId,
  DayNumber,
  ThreatCategory,
  Severity,
} from '../types/game'

/**
 * Helper to create a CaseId with branding
 */
function createCaseId(id: string): CaseId {
  return id as CaseId
}

/**
 * Helper to create a DocumentField
 */
function createField(
  id: string,
  label: string,
  type: DocumentField['type'],
  value: string,
  options: DocumentField['options'] = undefined,
  visible = true,
  pattern?: string,
  suspiciousHint?: string
): DocumentField {
  return { id, label, type, value, visible, options, pattern, suspiciousHint }
}

/**
 * Helper to create a Document
 */
function createDocument(
  id: string,
  type: string,
  fields: DocumentField[],
  hiddenFields?: DocumentField[]
): Document {
  return { id, type, fields, xrayRevealed: false, hiddenFields }
}

/**
 * Helper to create a Discrepancy
 */
function createDiscrepancy(
  id: string,
  fieldId: string,
  documentId: string,
  category: ThreatCategory,
  severity: Severity,
  description: string,
  explanation: string,
  isBlocking: boolean
): Discrepancy {
  return { id, fieldId, documentId, category, severity, description, explanation, isBlocking }
}

/**
 * Day 1 Cases - Focus: Phishing, Suspicious Links, and 1 Safe Case
 * All cases are for Day 1 (day: 1)
 */

// CASE 1: Phishing Email - Fake IT Support (Tutorial Case)
export const caseDay1_1: TravelerCase = {
  id: createCaseId('day1-case1'),
  day: 1,
  order: 1,
  travelerName: 'Carlos Mendes',
  avatarId: 'avatar-carlos',
  dialogue:
    'Bom dia! Recebi este e-mail do suporte de TI pedindo para atualizar minha senha urgente. Parece legítimo, o logo da empresa está lá e tudo.',
  documents: [
    createDocument('doc-email-1', 'E-mail Recebido', [
      createField(
        'field-from-name',
        'Nome do Remetente',
        'text',
        'Suporte TI Corporativo',
        undefined,
        true
      ),
      createField(
        'field-from-email',
        'E-mail do Remetente',
        'email',
        'suporte.ti@empresa-segura.xyz',
        undefined,
        true,
        undefined,
        'Domínio .xyz não é oficial da empresa'
      ),
      createField(
        'field-subject',
        'Assunto',
        'text',
        'URGENTE: Atualização de Senha Obrigatória - Ação em 1 Hora',
        undefined,
        true
      ),
      createField(
        'field-body',
        'Corpo do E-mail',
        'text',
        'Prezado colaborador,\n\nDetectamos atividade suspeita em sua conta. Por segurança, sua senha deve ser atualizada nas próximas 1 HORA.\n\nClique no link abaixo para redefinir:\n[Atualizar Minha Senha Agora](http://empresa-segura.xyz/reset?token=abc123)\n\nSe não fizer isso, sua conta será bloqueada permanentemente.\n\nAtenciosamente,\nEquipe de Segurança da Informação',
        undefined,
        true
      ),
      createField(
        'field-link-text',
        'Texto do Link',
        'text',
        'Atualizar Minha Senha Agora',
        undefined,
        true
      ),
      createField(
        'field-link-href',
        'URL Real do Link (Hover)',
        'url',
        'http://empresa-segura.xyz/reset?token=abc123',
        undefined,
        false, // Hidden initially, revealed with X-Ray or hover
        undefined,
        'Domínio .xyz suspeito, não é empresa.com.br'
      ),
    ]),
    createDocument('doc-badge-1', 'Crachá Funcional', [
      createField('field-badge-name', 'Nome', 'text', 'Carlos Mendes', undefined, true),
      createField('field-badge-id', 'Matrícula', 'text', 'FUNC-2024-0451', undefined, true),
      createField('field-badge-dept', 'Departamento', 'text', 'Financeiro', undefined, true),
      createField('field-badge-validity', 'Validade', 'date', '2025-12-31', undefined, true),
    ]),
  ],
  discrepancies: [
    createDiscrepancy(
      'disc-1-1',
      'field-from-email',
      'doc-email-1',
      'phishing',
      'high',
      'E-mail do remetente usa domínio .xyz não oficial',
      'O domínio oficial da empresa é @empresa.com.br. Domínios .xyz, .tk, .ml são frequentemente usados em phishing por serem baratos.',
      true
    ),
    createDiscrepancy(
      'disc-1-2',
      'field-link-href',
      'doc-email-1',
      'suspicious_link',
      'critical',
      'Link aponta para domínio malicioso empresa-segura.xyz',
      'O texto do link diz "Atualizar Minha Senha Agora" mas a URL real (revelada ao passar o mouse) aponta para um domínio .xyz suspeito. Nunca clique sem verificar.',
      true
    ),
    createDiscrepancy(
      'disc-1-3',
      'field-subject',
      'doc-email-1',
      'social_engineering',
      'medium',
      'Linguagem de urgência extrema ("1 HORA", "bloqueada permanentemente")',
      'Criar pressão de tempo é tática clássica de engenharia social para impedir verificação cuidadosa. E-mails legítimos de TI dão prazos razoáveis.',
      false
    ),
  ],
  correctDecision: 'deny',
  feedback: {
    approve:
      'INCORRETO: Você aprovou um e-mail de phishing! O domínio .xyz no remetente e no link são sinais claros. Carlos teria suas credenciais roubadas.',
    deny:
      'CORRETO: Você identificou o phishing! Domínio .xyz suspeito, link malicioso oculto e pressão de urgência. Carlos está seguro.',
  },
  points: 100,
  isTutorial: true,
}

// CASE 2: Phishing - Fake Bank Portal with Typosquatting
export const caseDay1_2: TravelerCase = {
  id: createCaseId('day1-case2'),
  day: 1,
  order: 2,
  travelerName: 'Ana Paula Silva',
  avatarId: 'avatar-ana',
  dialogue:
    'Oi, preciso de ajuda. Recebi um SMS dizendo que minha conta bancária foi comprometida e tem um link para "verificar". O site parece igual ao do meu banco.',
  documents: [
    createDocument('doc-sms-1', 'Mensagem SMS', [
      createField('field-sms-from', 'Remetente', 'text', 'Banco Central Brasil', undefined, true),
      createField('field-sms-body', 'Mensagem', 'text', 'ALERTA: Conta ****1234 comprometida. Acesse imediatamente: https://banc0-central.br/verifica para evitar bloqueio. Validade: 30 min.', undefined, true),
      createField('field-sms-link', 'Link na Mensagem', 'url', 'https://banc0-central.br/verifica', undefined, true, undefined, 'Zero no lugar do "o" - typosquatting'),
    ]),
    createDocument('doc-id-card-1', 'Documento de Identidade', [
      createField('field-id-name', 'Nome', 'text', 'Ana Paula Silva', undefined, true),
      createField('field-id-cpf', 'CPF', 'text', '123.456.789-00', undefined, true),
      createField('field-id-rg', 'RG', 'text', 'MG-12.345.678', undefined, true),
    ]),
    createDocument('doc-print-1', 'Print da Página Web (X-Ray)', [
      createField('field-print-url', 'URL na Barra de Endereços', 'url', 'https://banc0-central.br/verifica', undefined, false, undefined, 'Domínio banc0-central.br - zero no lugar de "o"'),
      createField('field-print-title', 'Título da Página', 'text', 'Banco Central - Verificação de Segurança', undefined, false),
      createField('field-print-ssl', 'Certificado SSL', 'text', 'Válido (Let\'s Encrypt)', undefined, false, undefined, 'SSL válido não garante legitimidade do site'),
      createField('field-print-form', 'Formulário Pedindo', 'text', 'Agência, Conta, Senha 4 dígitos, Token SMS', undefined, false),
    ], [
      createField('field-hidden-domain-age', 'Idade do Domínio', 'text', 'Registrado há 3 dias', undefined, false),
      createField('field-hidden-registrar', 'Registrador', 'text', 'NameCheap (privacidade ativada)', undefined, false),
    ]),
  ],
  discrepancies: [
    createDiscrepancy(
      'disc-2-1',
      'field-sms-link',
      'doc-sms-1',
      'phishing',
      'critical',
      'Typosquatting: "banc0" com zero no lugar de "o"',
      'O domínio banc0-central.br imita "banco-central.br" substituindo a letra "o" pelo número "0". Esta técnica é chamada typosquatting.',
      true
    ),
    createDiscrepancy(
      'disc-2-2',
      'field-print-url',
      'doc-print-1',
      'suspicious_link',
      'critical',
      'URL real confirma domínio falso',
      'A barra de endereços mostra banc0-central.br, não o domínio oficial do banco. Sempre verifique a URL na barra do navegador.',
      true
    ),
    createDiscrepancy(
      'disc-2-3',
      'field-hidden-domain-age',
      'doc-print-1',
      'phishing',
      'high',
      'Domínio registrado há apenas 3 dias',
      'Domínios legítimos de bancos têm anos de existência. Domínio novo + privacidade no WHOIS = forte indicador de phishing.',
      false
    ),
    createDiscrepancy(
      'disc-2-4',
      'field-sms-body',
      'doc-sms-1',
      'social_engineering',
      'medium',
      'Urgência artificial: "30 min", "evite bloqueio"',
      'Pressão de tempo e ameaça de bloqueio são táticas para forçar ação imediata sem verificação.',
      false
    ),
  ],
  correctDecision: 'deny',
  feedback: {
    approve:
      'INCORRETO: Ana Paula teria seus dados bancários roubados! O typosquatting (banc0 vs banco) e domínio de 3 dias são evidências claras.',
    deny:
      'CORRETO: Excelente identificação do typosquatting! O zero no lugar do "o" e domínio novo confirmam o golpe. Ana Paula está protegida.',
  },
  points: 150,
}

// CASE 3: Phishing - QR Code in Email (Modern Attack Vector)
export const caseDay1_3: TravelerCase = {
  id: createCaseId('day1-case3'),
  day: 1,
  order: 3,
  travelerName: 'Roberto Almeida',
  avatarId: 'avatar-roberto',
  dialogue:
    'Chegou este e-mail do RH sobre atualização de dados cadastrais. Tem um QR code para escanear com o celular e confirmar meus dados. Prático, né?',
  documents: [
    createDocument('doc-email-3', 'E-mail do RH', [
      createField('field-from-name-3', 'Nome do Remetente', 'text', 'Recursos Humanos', undefined, true),
      createField('field-from-email-3', 'E-mail do Remetente', 'email', 'rh@empresa-rh-services.tk', undefined, true, undefined, 'Domínio .tk gratuito - sinal de alerta'),
      createField('field-subject-3', 'Assunto', 'text', 'Atualização Cadastral Obrigatória - Prazo: Hoje', undefined, true),
      createField('field-body-3', 'Corpo', 'text', 'Prezado Roberto,\n\nConforme determinação da diretoria, todos os colaboradores devem atualizar seus dados cadastrais até HOJE.\n\nEscaneie o QR Code abaixo com seu celular para acessar o formulário seguro:\n\n[QR CODE IMAGEM]\n\nLink alternativo: https://empresa-rh-services.tk/cadastro/roberto-almeida\n\nSem esta atualização, seu pagamento do mês pode ser atrasado.\n\nAtenciosamente,\nEquipe de RH', undefined, true),
      createField('field-qr-alt-link', 'Link Alternativo', 'url', 'https://empresa-rh-services.tk/cadastro/roberto-almeida', undefined, true, undefined, 'Mesmo domínio suspeito .tk'),
    ]),
    createDocument('doc-qr-analysis', 'Análise do QR Code (X-Ray)', [
      createField('field-qr-target', 'URL de Destino do QR', 'url', 'https://phishing-form.ml/collect?target=roberto', undefined, false, undefined, 'Domínio .ml diferente do link no e-mail - redirecionamento malicioso'),
      createField('field-qr-params', 'Parâmetros', 'text', 'target=roberto (pré-preenchido)', undefined, false),
    ], [
      createField('field-qr-redirect', 'Cadeia de Redirecionamento', 'text', 'empresa-rh-services.tk → phishing-form.ml → steal-data.xyz', undefined, false),
    ]),
    createDocument('doc-badge-3', 'Crachá Funcional', [
      createField('field-badge-name-3', 'Nome', 'text', 'Roberto Almeida', undefined, true),
      createField('field-badge-id-3', 'Matrícula', 'text', 'FUNC-2023-0198', undefined, true),
      createField('field-badge-dept-3', 'Departamento', 'text', 'Logística', undefined, true),
    ]),
  ],
  discrepancies: [
    createDiscrepancy(
      'disc-3-1',
      'field-from-email-3',
      'doc-email-3',
      'phishing',
      'high',
      'Domínio .tk (gratuito) no e-mail do remetente',
      'Domínios .tk, .ml, .ga, .cf, .gq são gratuitos e amplamente abusados por phishers. RH oficial usaria @empresa.com.br.',
      true
    ),
    createDiscrepancy(
      'disc-3-2',
      'field-qr-target',
      'doc-qr-analysis',
      'suspicious_link',
      'critical',
      'QR Code aponta para domínio diferente do link no e-mail',
      'O QR code leva para phishing-form.ml, enquanto o link texto aponta para empresa-rh-services.tk. Redirecionamento oculto é técnica avançada de phishing.',
      true
    ),
    createDiscrepancy(
      'disc-3-3',
      'field-qr-alt-link',
      'doc-email-3',
      'phishing',
      'high',
      'Link alternativo também usa domínio suspeito .tk',
      'Mesmo o link "alternativo" no texto do e-mail usa domínio gratuito .tk. Consistência no golpe.',
      false
    ),
    createDiscrepancy(
      'disc-3-4',
      'field-body-3',
      'doc-email-3',
      'social_engineering',
      'medium',
      'Ameaça de atraso no pagamento',
      'Usar salário como pressão é engenharia social direcionada. RH legítimo não ameaçaria pagamento por atualização cadastral.',
      false
    ),
  ],
  correctDecision: 'deny',
  feedback: {
    approve:
      'INCORRETO: Roberto caiu no golpe do QR code! O código levava a um formulário de coleta de dados em domínio .ml, diferente do link visível. Seus dados pessoais e bancários seriam roubados.',
    deny:
      'CORRETO: Identificou o QR code malicioso! Domínio .tk no e-mail, QR code redirecionando para .ml, e ameaça de atraso no pagamento. Roberto está a salvo.',
  },
  points: 200,
}

// CASE 4: SAFE CASE - Legitimate Internal Request
export const caseDay1_4: TravelerCase = {
  id: createCaseId('day1-case4'),
  day: 1,
  order: 4,
  travelerName: 'Mariana Costa',
  avatarId: 'avatar-mariana',
  dialogue:
    'Bom dia! O setor de compras me enviou este e-mail para confirmar o recebimento do material. O link vai para o sistema interno da empresa.',
  documents: [
    createDocument('doc-email-4', 'E-mail Interno', [
      createField('field-from-name-4', 'Nome do Remetente', 'text', 'Setor de Compras', undefined, true),
      createField('field-from-email-4', 'E-mail do Remetente', 'email', 'compras@empresa.com.br', undefined, true),
      createField('field-subject-4', 'Assunto', 'text', 'Confirmação de Recebimento - OC #2024-1547', undefined, true),
      createField('field-body-4', 'Corpo', 'text', 'Prezada Mariana,\n\nConforme ordem de compra #2024-1547, solicitamos confirmação do recebimento dos itens:\n- 50x Cabo HDMI 2m\n- 20x Mouse Sem Fio Logitech\n- 10x Teclado Mecânico Keychron\n\nPor favor, acesse o sistema interno e confirme o recebimento:\nhttps://sistema.intranet.empresa.com.br/compras/recebimento/2024-1547\n\nPrazo: 2 dias úteis.\n\nDúvidas, responder este e-mail ou ramal 2145.\n\nAtt,\nEquipe de Compras', undefined, true),
      createField('field-link-4', 'Link do Sistema', 'url', 'https://sistema.intranet.empresa.com.br/compras/recebimento/2024-1547', undefined, true),
    ]),
    createDocument('doc-po-4', 'Ordem de Compra (Anexo)', [
      createField('field-po-number', 'Número OC', 'text', '2024-1547', undefined, true),
      createField('field-po-date', 'Data', 'date', '2024-11-15', undefined, true),
      createField('field-po-requester', 'Solicitante', 'text', 'Mariana Costa - Logística', undefined, true),
      createField('field-po-items', 'Itens', 'text', 'Cabo HDMI (50), Mouse Sem Fio (20), Teclado Mecânico (10)', undefined, true),
      createField('field-po-status', 'Status', 'select', 'Entregue', ['Pendente', 'Entregue', 'Cancelado'], true),
    ]),
    createDocument('doc-badge-4', 'Crachá Funcional', [
      createField('field-badge-name-4', 'Nome', 'text', 'Mariana Costa', undefined, true),
      createField('field-badge-id-4', 'Matrícula', 'text', 'FUNC-2022-0334', undefined, true),
      createField('field-badge-dept-4', 'Departamento', 'text', 'Logística / Recebimento', undefined, true),
    ]),
  ],
  discrepancies: [
    createDiscrepancy(
      'disc-4-1',
      'field-from-email-4',
      'doc-email-4',
      'none',
      'low',
      'Domínio oficial @empresa.com.br confirmado',
      'O remetente usa o domínio corporativo oficial. Nenhum sinal de spoofing.',
      false
    ),
    createDiscrepancy(
      'disc-4-2',
      'field-link-4',
      'doc-email-4',
      'none',
      'low',
      'Link aponta para subdomínio oficial intranet.empresa.com.br',
      'A URL usa HTTPS, subdomínio intranet oficial, e caminho coerente com sistema interno. Legítimo.',
      false
    ),
    createDiscrepancy(
      'disc-4-3',
      'field-po-number',
      'doc-po-4',
      'none',
      'low',
      'Ordem de compra confere com e-mail e solicitante',
      'OC #2024-1547 corresponde ao e-mail e a solicitante é a própria Mariana. Consistência total.',
      false
    ),
  ],
  correctDecision: 'approve',
  feedback: {
    approve:
      'CORRETO: E-mail legítimo do setor de compras! Domínio oficial, link para intranet, OC confere, solicitante correto. Mariana pode confirmar o recebimento com segurança.',
    deny:
      'INCORRETO: Você barrou uma solicitação legítima! Todos os indicadores conferem: domínio oficial, link interno, documento anexo válido. Isso atrasa o processo de compras.',
  },
  points: 100,
}

/**
 * All Day 1 cases in order
 */
export const day1Cases: TravelerCase[] = [
  caseDay1_1,
  caseDay1_2,
  caseDay1_3,
  caseDay1_4,
]

/**
 * Get cases for a specific day
 */
export function getCasesForDay(day: DayNumber): TravelerCase[] {
  switch (day) {
    case 1:
      return day1Cases
    case 2:
      return [] // TODO: Day 2 cases
    case 3:
      return [] // TODO: Day 3 cases
    case 4:
      return [] // TODO: Day 4 cases
    case 5:
      return [] // TODO: Day 5 cases
    default:
      return []
  }
}

/**
 * Get a specific case by ID
 */
export function getCaseById(id: CaseId): TravelerCase | undefined {
  return day1Cases.find((c) => c.id === id)
}

/**
 * Day 1 Configuration
 */
export const day1Config = {
  day: 1 as DayNumber,
  title: 'Dia 1: Fundamentos de Phishing',
  description:
    'Aprenda a identificar e-mails de phishing, links suspeitos, typosquatting e QR codes maliciosos. Um caso seguro para calibrar seu julgamento.',
  cases: day1Cases,
  unlockedRules: [
    'rule-verify-sender',
    'rule-check-domain',
    'rule-hover-links',
    'rule-urgency-pressure',
    'rule-verify-independently',
  ],
  availableTools: ['xray', 'manual'] as const,
  timeLimit: 300, // 5 minutes per case
}