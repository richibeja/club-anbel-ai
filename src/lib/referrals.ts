// Sistema de Referidos del Club

export function generateReferralCode(memberId: string): string {
  // Genera código único: ANBEL-XXXXX
  const prefix = 'ANBEL';
  const suffix = memberId.substring(0, 5).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${random}`;
}

export function calculateReferralBenefits(referralsCount: number): {
  freeWeeks: number;
  level: string;
  badge: string;
} {
  if (referralsCount >= 10) {
    return {
      freeWeeks: 12, // 3 meses
      level: 'Embajador',
      badge: '👑'
    };
  } else if (referralsCount >= 5) {
    return {
      freeWeeks: 8, // 2 meses
      level: 'Líder',
      badge: '🌟'
    };
  } else if (referralsCount >= 3) {
    return {
      freeWeeks: 4, // 1 mes
      level: 'Activo',
      badge: '⭐'
    };
  } else if (referralsCount >= 1) {
    return {
      freeWeeks: 1, // 1 semana
      level: 'Iniciado',
      badge: '✨'
    };
  }
  
  return {
    freeWeeks: 0,
    level: 'Sin referidos',
    badge: '👤'
  };
}

export function getNewMemberDiscount(hasReferralCode: boolean): number {
  // Descuento de $5 para nuevos miembros con código
  return hasReferralCode ? 5 : 0;
}

export function getReferralMessage(member: any): string {
  const code = member.referral_code || 'No asignado';
  const count = member.referrals_count || 0;
  const earned = member.free_weeks_earned || 0;
  const used = member.free_weeks_used || 0;
  const available = earned - used;

  const benefits = calculateReferralBenefits(count);

  return `🎁 *TU PROGRAMA DE REFERIDOS*

📋 *Tu código:* \`${code}\`

👥 *Referidos activos:* ${count}
${benefits.badge} *Nivel:* ${benefits.level}

💰 *Beneficios:*
• Semanas gratis ganadas: ${earned}
• Semanas gratis usadas: ${used}
• *Semanas disponibles:* ${available} 🎉

📊 *Progreso:*
${getProgressBar(count)}

🎯 *Próximo nivel:*
${getNextLevelMessage(count)}

💡 *Comparte tu código:*
Envía este mensaje a tus amigos:

_"🎰 Únete al Club Anbel AI!
Sistema de loterías con IA
$10/semana o $40/mes

Usa mi código: ${code}
¡Recibes $5 de descuento!

WhatsApp: +573144467389"_
`;
}

function getProgressBar(count: number): string {
  const levels = [
    { min: 0, max: 1, icon: '▱', goal: 1 },
    { min: 1, max: 3, icon: '▰', goal: 3 },
    { min: 3, max: 5, icon: '▰▰', goal: 5 },
    { min: 5, max: 10, icon: '▰▰▰', goal: 10 }
  ];

  let progress = '';
  
  if (count === 0) progress = '▱▱▱▱ (0/1)';
  else if (count < 3) progress = `▰${'▱'.repeat(3)} (${count}/3)`;
  else if (count < 5) progress = `▰▰${'▱'.repeat(2)} (${count}/5)`;
  else if (count < 10) progress = `▰▰▰▱ (${count}/10)`;
  else progress = `▰▰▰▰ (${count}/10+) ¡Máximo nivel!`;

  return progress;
}

function getNextLevelMessage(count: number): string {
  if (count === 0) return 'Refiere 1 persona para ganar 1 semana gratis';
  if (count < 3) return `Refiere ${3 - count} más para ganar 1 mes gratis`;
  if (count < 5) return `Refiere ${5 - count} más para ganar 2 meses gratis`;
  if (count < 10) return `Refiere ${10 - count} más para ganar 3 meses gratis + Badge`;
  return '¡Has alcanzado el nivel máximo! 👑';
}

export function validateReferralCode(code: string): boolean {
  // Valida formato: ANBEL-XXXXX
  const regex = /^ANBEL-[A-Z0-9]{5}$/;
  return regex.test(code);
}

