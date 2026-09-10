import { UserProfile, PremiumAccessCode } from '../types';

export class StorageService {
  private static readonly PROFILE_KEY = 'sante_prep_user_profile';
  private static readonly PREMIUM_CODES_KEY = 'sante_prep_premium_codes';
  private static readonly DEVICE_ID_KEY = 'sante_prep_device_id';
  private static readonly ADMIN_ACCOUNTS_KEY = 'sante_prep_admin_accounts';

  /**
   * Génère ou récupère un ID d'appareil unique
   */
  public static getDeviceId(): string {
    let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = `DEVICE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  }

  /**
   * Récupère le profil utilisateur
   */
  public static getUserProfile(): UserProfile | null {
    const data = localStorage.getItem(this.PROFILE_KEY);
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  }

  /**
   * Sauvegarde le profil utilisateur
   */
  public static saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
  }

  /**
   * Crée un nouveau profil utilisateur
   */
  public static createUserProfile(fullName: string): UserProfile {
    const profile: UserProfile = {
      fullName,
      level: null,
      filiere: null,
      isPremium: false,
      premiumExpiryDate: null,
      createdAt: new Date().toISOString(),
      deviceId: this.getDeviceId()
    };
    this.saveUserProfile(profile);
    return profile;
  }

  /**
   * Génère un code d'accès premium (Admin uniquement)
   */
  public static generatePremiumAccessCode(maxUses: number = 1): PremiumAccessCode {
    const code = `SANTÉ-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Valide 1 an

    const accessCode: PremiumAccessCode = {
      code,
      createdAt: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      maxUses,
      currentUses: 0,
      isActive: true,
      usedByDevices: []
    };

    const codes = this.getAllPremiumAccessCodes();
    codes.push(accessCode);
    localStorage.setItem(this.PREMIUM_CODES_KEY, JSON.stringify(codes));

    return accessCode;
  }

  /**
   * Récupère tous les codes d'accès premium (Admin uniquement)
   */
  public static getAllPremiumAccessCodes(): PremiumAccessCode[] {
    const data = localStorage.getItem(this.PREMIUM_CODES_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Valide un code d'accès premium et active l'abonnement
   */
  public static validateAccessCode(code: string): { success: boolean; message: string; expiryDate?: string } {
    const codes = this.getAllPremiumAccessCodes();
    const accessCode = codes.find(c => c.code === code);

    if (!accessCode) {
      return { success: false, message: "Code d'accès invalide ou inexistant." };
    }

    if (!accessCode.isActive) {
      return { success: false, message: "Ce code d'accès est désactivé." };
    }

    const expiryDate = new Date(accessCode.expiryDate);
    if (new Date() > expiryDate) {
      return { success: false, message: "Ce code d'accès a expiré." };
    }

    if (accessCode.currentUses >= accessCode.maxUses) {
      return { success: false, message: "Ce code d'accès a atteint sa limite d'utilisation." };
    }

    const deviceId = this.getDeviceId();
    const profile = this.getUserProfile() || this.createUserProfile('Utilisateur');

    // Vérifier si l'appareil a déjà utilisé ce code
    if (accessCode.usedByDevices.includes(deviceId)) {
      // L'appareil peut réutiliser le même code, on met juste à jour l'expiry
      const premiumExpiryDate = new Date();
      premiumExpiryDate.setFullYear(premiumExpiryDate.getFullYear() + 1);
      profile.isPremium = true;
      profile.premiumExpiryDate = premiumExpiryDate.toISOString();
      this.saveUserProfile(profile);

      return {
        success: true,
        message: "Accès Premium réactivé avec succès ! Valide pour 12 mois.",
        expiryDate: premiumExpiryDate.toISOString()
      };
    } else {
      // Nouvel appareil utilisant ce code
      accessCode.currentUses++;
      accessCode.usedByDevices.push(deviceId);

      const premiumExpiryDate = new Date();
      premiumExpiryDate.setFullYear(premiumExpiryDate.getFullYear() + 1);

      profile.isPremium = true;
      profile.premiumExpiryDate = premiumExpiryDate.toISOString();

      const index = codes.findIndex(c => c.code === code);
      codes[index] = accessCode;
      localStorage.setItem(this.PREMIUM_CODES_KEY, JSON.stringify(codes));
      this.saveUserProfile(profile);

      return {
        success: true,
        message: "Accès Premium activé avec succès ! Valide pour 12 mois.",
        expiryDate: premiumExpiryDate.toISOString()
      };
    }
  }

  /**
   * Vérifie si le premium est toujours actif
   */
  public static isPremiumActive(): boolean {
    const profile = this.getUserProfile();
    if (!profile || !profile.isPremium || !profile.premiumExpiryDate) {
      return false;
    }

    const expiryDate = new Date(profile.premiumExpiryDate);
    return new Date() < expiryDate;
  }

  /**
   * Obtient le nombre de jours restants pour le premium
   */
  public static getPremiumDaysRemaining(): number {
    const profile = this.getUserProfile();
    if (!profile || !profile.premiumExpiryDate) {
      return 0;
    }

    const expiryDate = new Date(profile.premiumExpiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  /**
   * Sauvegarde les comptes administrateur (Admin uniquement)
   */
  public static saveAdminAccounts(accounts: any[]): void {
    localStorage.setItem(this.ADMIN_ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  /**
   * Récupère les comptes administrateur
   */
  public static getAdminAccounts(): any[] {
    const data = localStorage.getItem(this.ADMIN_ACCOUNTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Initialise les comptes administrateur par défaut
   */
  public static initializeDefaultAdminAccounts(): void {
    const existingAccounts = this.getAdminAccounts();
    if (existingAccounts.length === 0) {
      const defaultAccounts = [
        {
          username: 'admin',
          password: 'admin2026',
          email: 'Koffikouadiojonas553@gmail.com'
        }
      ];
      this.saveAdminAccounts(defaultAccounts);
    }
  }
}
