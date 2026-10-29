import type { ManualRule, ThreatCategory, DayNumber } from '../types/game'

/**
 * Manual rules unlocked by day.
 * Day 1 focuses on Phishing/Suspicious Links and basic verification.
 */
export const manualRules: ManualRule[] = [
  // Day 1 Rules - Phishing & Suspicious Links Focus
  {
    id: 'rule-verify-sender',
    unlockedDay: 1,
    title: 'Verifique o Remetente',
    description:
      'Sempre verifique o endereço de e-mail real do remetente, não apenas o nome exibido. Phishers frequentemente usam nomes de exibição legítimos (ex: "Suporte TI") com endereços de domínios suspeitos.',
    example: 'Nome: "Suporte TI Corporativo" | E-mail: suporte.ti@empresa-segura.com.br ✓\nNome: "Suporte TI Corporativo" | E-mail: suporte.ti@empresa-segura.xyz ✗',
    category: 'phishing',
    priority: 1,
  },
  {
    id: 'rule-check-domain',
    unlockedDay: 1,
    title: 'Inspecione o Domínio Cuidadosamente',
    description:
      'Domínios maliciosos frequentemente imitam domínios legítimos com pequenas variações: subdomínios enganosos (seguranca.banco.com.phisher.com), typosquatting (banco0.com vs banco.com), ou TLDs suspeitos (.xyz, .tk, .ml, .ga, .cf).',
    example: 'Legítimo: https://portal.banco.com.br/login\nPhishing: https://portal.banco.com.br.phishing-site.xyz/login\nPhishing: https://banc0.com.br/portal',
    category: 'phishing',
    priority: 2,
  },
  {
    id: 'rule-hover-links',
    unlockedDay: 1,
    title: 'Passe o Mouse Sobre Links (Hover)',
    description:
      'Nunca clique diretamente em links suspeitos. Passe o mouse sobre o link para ver a URL real de destino. O texto do link pode dizer "Acesse seu conta" mas o href real aponta para um site malicioso.',
    example: 'Texto: "Acesse o portal oficial"\nURL real (hover): https://phishing-site.tk/steal-credentials',
    category: 'suspicious_link',
    priority: 3,
  },
  {
    id: 'rule-urgency-pressure',
    unlockedDay: 1,
    title: 'Cuidado com Urgência e Ameaças',
    description:
      'E-mails que criam senso de urgência extrema ("Sua conta será excluída em 1 hora!", "Ação imediata necessária") são táticas clássicas de engenharia social para impedir que você pense criticamente.',
    example: '"Seu acesso será revogado em 30 minutos se não clicar aqui!" → Sinal de alerta vermelho',
    category: 'social_engineering',
    priority: 4,
  },
  {
    id: 'rule-verify-independently',
    unlockedDay: 1,
    title: 'Verifique Independentemente',
    description:
      'Se um e-mail pede credenciais, pagamentos ou ações sensíveis, não use links ou números do e-mail. Acesse o site oficial digitando a URL manualmente ou use canais de contato conhecidos.',
    example: 'E-mail diz: "Clique aqui para resetar senha" → Em vez disso, digite portal.empresa.com.br no navegador',
    category: 'phishing',
    priority: 5,
  },

  // Day 2 Rules - Malware & Attachments (placeholder for future)
  {
    id: 'rule-suspicious-attachments',
    unlockedDay: 2,
    title: 'Desconfie de Anexos Inesperados',
    description:
      'Arquivos .exe, .zip, .scr, .js, .vbs, .bat, .cmd, .msi, .pdf com macros podem conter malware. Mesmo .pdf e .docx podem explorar vulnerabilidades.',
    example: 'Fatura_123.pdf.exe (extensão dupla) | Documento_importante.zip contendo .scr',
    category: 'malware',
    priority: 1,
  },
  {
    id: 'rule-macros-warning',
    unlockedDay: 2,
    title: 'Nunca Habilite Macros Automaticamente',
    description:
      'Documentos Office que pedem para "Habilitar Conteúdo" ou "Habilitar Macros" são vetores comuns de malware. Só habilite se você tem 100% de certeza da origem.',
    example: 'Documento pede: "Clique em Habilitar Conteúdo para visualizar" → Feche e reporte',
    category: 'malware',
    priority: 2,
  },

  // Day 3 Rules - Social Engineering & Impersonation (placeholder)
  {
    id: 'rule-verify-identity',
    unlockedDay: 3,
    title: 'Confirme Identidade por Outro Canal',
    description:
      'Se alguém se passa por colega, chefe ou suporte pedindo algo incomum, confirme por canal conhecido (Teams, Slack, telefone corporativo, presencial).',
    example: '"Sou o diretor, preciso que você compre gift cards urgente" → Ligue para o ramal oficial do diretor',
    category: 'impersonation',
    priority: 1,
  },

  // Day 4 Rules - Data Leak & Privacy (placeholder)
  {
    id: 'rule-data-minimization',
    unlockedDay: 4,
    title: 'Princípio do Menor Privilégio',
    description:
      'Nunca compartilhe mais informações do que o necessário. Dados sensíveis (CPF, senhas, tokens, dados bancários) nunca devem ser enviados por e-mail ou chat não criptografado.',
    example: 'Colega pede: "Manda sua senha do sistema por e-mail" → Recuse e reporte',
    category: 'data_leak',
    priority: 1,
  },

  // Day 5 Rules - Advanced Threats (placeholder)
  {
    id: 'rule-qr-code-caution',
    unlockedDay: 5,
    title: 'Cuidado com QR Codes',
    description:
      'QR codes em e-mails, documentos ou locais físicos podem direcionar para sites maliciosos. Sempre visualize a URL antes de acessar.',
    example: 'QR code no e-mail "Atualize seu cadastro" → Aponta para phishing-site.ml',
    category: 'phishing',
    priority: 1,
  },
]

/**
 * Get rules unlocked up to a specific day
 */
export function getRulesForDay(day: DayNumber): ManualRule[] {
  return manualRules
    .filter((rule) => rule.unlockedDay <= day)
    .sort((a, b) => a.priority - b.priority)
}

/**
 * Get rules by category
 */
export function getRulesByCategory(category: ThreatCategory): ManualRule[] {
  return manualRules.filter((rule) => rule.category === category)
}

/**
 * Get a specific rule by ID
 */
export function getRuleById(id: string): ManualRule | undefined {
  return manualRules.find((rule) => rule.id === id)
}