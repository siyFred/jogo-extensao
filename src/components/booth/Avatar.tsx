import { ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

type AvatarType = 'traveler' | 'approved' | 'denied' | 'loading'

interface AvatarProps {
  avatarId: string
  type: AvatarType
  className?: string
}

const avatarStyles: Record<string, { bg: string; icon: string }> = {
  'avatar-carlos': { bg: 'bg-amber-600', icon: '👨‍💼' },
  'avatar-ana': { bg: 'bg-emerald-600', icon: '👩‍💼' },
  'avatar-roberto': { bg: 'bg-blue-600', icon: '👨‍🔧' },
  'avatar-mariana': { bg: 'bg-violet-600', icon: '👩‍💻' },
  'avatar-default': { bg: 'bg-slate-600', icon: '👤' },
}

function getAvatarStyle(avatarId: string) {
  return avatarStyles[avatarId] ?? avatarStyles['avatar-default']
}

export function Avatar({ avatarId, type, className = '' }: AvatarProps) {
  const style = getAvatarStyle(avatarId)
  const isLoading = type === 'loading'

  return (
    <motion.div
      className={`relative w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center overflow-hidden ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Avatar content */}
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="w-6 h-6 text-slate-200/80 animate-spin" />
        ) : type === 'approved' ? (
          <ShieldCheck className="w-7 h-7 text-green-400" strokeWidth={2.5} />
        ) : type === 'denied' ? (
          <AlertTriangle className="w-7 h-7 text-red-400" strokeWidth={2.5} />
        ) : (
          <span className="text-3xl" aria-hidden="true">{style.icon}</span>
        )}
      </div>

      {/* Status ring */}
      {!isLoading && (
        <motion.div
          className={`absolute inset-0 rounded-2xl border-3 ${
            type === 'approved'
              ? 'border-green-400'
              : type === 'denied'
              ? 'border-red-400'
              : 'border-transparent'
          }`}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: type !== 'traveler' ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}