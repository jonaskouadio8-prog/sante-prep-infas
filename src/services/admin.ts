import { StorageService } from './storage';

export class AdminService {
  private static readonly ADMIN_USERNAME = 'admin';
  private static readonly ADMIN_PASSWORD = 'admin2026';
  private static readonly ADMIN_SESSION_KEY = 'sante_prep_admin_session';

  /**
   * Authentifie un administrateur
   */
  public static authenticate(username: string, password: string): { success: boolean; message: string; token?: string } {
    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      const token = `ADMIN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify({
        token,
        loginTime: new Date().toISOString(),
        expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 heures
      }));
      return {
        success: true,
        message: "Authentification admin réussie.",
        token
      };
    }
    return { success: false, message: "Identifiants administrateur incorrects." };
  }

  /**
   * Vérifie si une session admin est active
   */
  public static isSessionActive(): boolean {
    const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
    if (!sessionData) return false;

    try {
      const session = JSON.parse(sessionData);
      const expiryTime = new Date(session.expiryTime);
      return new Date() < expiryTime;
    } catch {
      return false;
    }
  }

  /**
   * Déconnecte l'administrateur
   */
  public static logout(): void {
    localStorage.removeItem(this.ADMIN_SESSION_KEY);
  }

  /**
   * Génère un nouveau code d'accès premium
   */
  public static generateAccessCode(maxUses: number = 1) {
    if (!this.isSessionActive()) {
      return { success: false, message: "Session admin expirée. Veuillez vous reconnecter." };
    }
    try {
      const accessCode = StorageService.generatePremiumAccessCode(maxUses);
      return {
        success: true,
        message: "Code d'accès généré avec succès.",
        accessCode
      };
    } catch (error) {
      return { success: false, message: "Erreur lors de la génération du code." };
    }
  }

  /**
   * Liste tous les codes d'accès
   */
  public static getAllAccessCodes() {
    if (!this.isSessionActive()) {
      return { success: false, message: "Session admin expirée." };
    }
    try {
      const codes = StorageService.getAllPremiumAccessCodes();
      return { success: true, codes };
    } catch (error) {
      return { success: false, message: "Erreur lors de la récupération des codes." };
    }
  }

  /**
   * Désactive un code d'accès
   */
  public static deactivateAccessCode(code: string) {
    if (!this.isSessionActive()) {
      return { success: false, message: "Session admin expirée." };
    }
    try {
      const codes = StorageService.getAllPremiumAccessCodes();
      const index = codes.findIndex(c => c.code === code);
      if (index !== -1) {
        codes[index].isActive = false;
        localStorage.setItem('sante_prep_premium_codes', JSON.stringify(codes));
        return { success: true, message: "Code d'accès désactivé." };
      }
      return { success: false, message: "Code non trouvé." };
    } catch (error) {
      return { success: false, message: "Erreur lors de la désactivation du code." };
    }
  }
}
