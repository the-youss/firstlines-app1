
type _Environment = 'local' | 'staging' | 'production'

export class Environment {
  static get env(): _Environment {
    return (process.env.NEXT_PUBLIC_ENV || 'local') as _Environment
  }


  static isLocal(): boolean {
    return this.env === 'local'
  }

  static isStaging(): boolean {
    return this.env === 'staging'
  }

  static isProduction(): boolean {
    return this.env === 'production'
  }
}