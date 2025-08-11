import * as Sentry from '@sentry/react'

const sentryDsn = import.meta.env.VITE_SENTRY_DSN
const environment = import.meta.env.VITE_APP_ENV || 'development'

export const initSentry = () => {
  if (sentryDsn && environment !== 'development') {
    Sentry.init({
      dsn: sentryDsn,
      environment,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: 1.0,
      beforeSend(event, hint) {
        // Filter out non-critical errors in development
        if (environment === 'development') {
          console.error('Sentry Event:', event, hint)
        }
        return event
      },
    })
  }
}

export const captureError = (error: Error, context?: Record<string, any>) => {
  if (environment === 'development') {
    console.error('Application Error:', error, context)
  }
  
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setContext(key, context[key])
      })
    }
    Sentry.captureException(error)
  })
}

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  if (environment === 'development') {
    console.log(`[${level.toUpperCase()}] ${message}`)
  }
  
  Sentry.captureMessage(message, level as any)
}

export default Sentry
