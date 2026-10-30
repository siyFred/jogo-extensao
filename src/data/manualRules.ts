import type { ManualRule, ThreatCategory, DayNumber } from '../types/game'

/**
 * Manual rules unlocked by day.
 * Day 1 focuses on Phishing/Suspicious Links and basic verification.
 */
export const manualRules: ManualRule[] = [
  {
    id: 'rule-verify-sender',
    unlockedDay: 1,
    title: 'Olhe o e-mail de quem mandou',
    description:
      'O nome na tela pode ser inventado, mas o endereço de e-mail não mente. Golpistas usam nomes como "Suporte" ou "Banco" com um endereço estranho.',
    example: 'Nome: "Suporte TI" | suporte@empresa.com.br ✓ (endereço da empresa)\nNome: "Suporte TI" | suporte@empresa-segura.xyz ✗ (endereço esquisito)',
    category: 'phishing',
    priority: 1,
  },
  {
    id: 'rule-check-domain',
    unlockedDay: 1,
    title: 'Confira o endereço do site',
    description:
      'O endereço do site (domínio) falso costuma parecer com o verdadeiro: uma letra trocada, um número no lugar de letra (banc0) ou final estranho como .xyz, .tk e .ml.',
    example: 'Verdadeiro: banco.com.br\nFalso: banc0.com.br (zero no lugar do "o")\nFalso: banco.com.br.golpe.xyz (o site de verdade é o final: golpe.xyz)',
    category: 'phishing',
    priority: 2,
  },
  {
    id: 'rule-hover-links',
    unlockedDay: 1,
    title: 'Veja para onde o link leva',
    description:
      'O texto de um link pode dizer uma coisa e levar para outra. No computador, passe o mouse em cima; no celular, segure o dedo no link. Use o Raio-X para ver o destino real.',
    example: 'O link diz: "Acesse o portal oficial"\nMas leva para: golpe-site.tk ✗',
    category: 'suspicious_link',
    priority: 3,
  },
  {
    id: 'rule-urgency-pressure',
    unlockedDay: 1,
    title: 'Desconfie de pressa e ameaça',
    description:
      'Golpistas querem que você fique com medo e aja sem pensar. Mensagens como "faça agora ou perde a conta" são sinal de alerta.',
    example: '"Sua conta será apagada em 30 minutos se você não clicar!" → Pare e desconfie',
    category: 'social_engineering',
    priority: 4,
  },
  {
    id: 'rule-verify-independently',
    unlockedDay: 1,
    title: 'Confirme por conta própria',
    description:
      'Se a mensagem pede senha, dinheiro ou dados, não use o link nem o telefone dela. Abra o site oficial digitando o endereço você mesmo ou ligue para um número que você já conhece.',
    example: 'Mensagem diz: "Clique para trocar a senha" → Em vez disso, digite o site oficial no navegador',
    category: 'phishing',
    priority: 5,
  },
  {
    id: 'rule-suspicious-attachments',
    unlockedDay: 2,
    title: 'Cuidado com arquivos inesperados',
    description:
      'Arquivos que você não pediu podem instalar vírus (malware). Fique atento a nomes com duas terminações e a arquivos como .exe, .zip e .scr.',
    example: 'Fatura.pdf.exe ✗ (parece PDF, mas é um programa)',
    category: 'malware',
    priority: 1,
  },
  {
    id: 'rule-macros-warning',
    unlockedDay: 2,
    title: 'Não clique em "Habilitar conteúdo"',
    description:
      'Se um documento pedir para "Habilitar macros" ou "Habilitar conteúdo", pode ser um truque para instalar vírus. Só aceite se tiver certeza total de quem enviou.',
    example: 'Documento diz: "Clique em Habilitar Conteúdo para ver" → Feche e avise alguém',
    category: 'malware',
    priority: 2,
  },
  {
    id: 'rule-verify-identity',
    unlockedDay: 3,
    title: 'Confirme se a pessoa é quem diz ser',
    description:
      'Alguém pode fingir ser seu chefe, colega ou suporte. Se o pedido for estranho, confirme por outro meio que você já usa, como ligar ou falar pessoalmente.',
    example: '"Sou o diretor, compre vale-presente agora!" → Ligue para ele no número oficial',
    category: 'impersonation',
    priority: 1,
  },
  {
    id: 'rule-data-minimization',
    unlockedDay: 4,
    title: 'Não passe dados que não precisa',
    description:
      'Compartilhe só o necessário. Senha, CPF, número de cartão e códigos nunca devem ser mandados por e-mail ou mensagem.',
    example: 'Alguém pede: "Manda sua senha por e-mail" → Recuse e avise',
    category: 'data_leak',
    priority: 1,
  },
  {
    id: 'rule-qr-code-caution',
    unlockedDay: 5,
    title: 'Cuidado com QR Code',
    description:
      'Um QR Code pode levar a um site falso, e você não vê o endereço antes de abrir. Se o celular mostrar o endereço, leia antes de entrar.',
    example: 'QR Code em e-mail: "Atualize seu cadastro" → Leva para golpe-site.ml ✗',
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