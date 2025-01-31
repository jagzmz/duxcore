import { User } from ".prisma/client";
import Twig from "twig";
import { prismaInstance } from "../../prisma/instance";
import { transport } from "../util/mailer";
import Password from "./Password";
import mjml2html from 'mjml'

export default class UserManager {

  private _raw: User;

  constructor(raw: User) {
    this._raw = raw;
  }

  get id(): string { return this._raw.id; }
  get email(): string { return this._raw.email; }
  get password(): string | null { return this._raw.password }

  get created(): Date { return this._raw.created }

  get firstName(): string { return this._raw.firstName; }
  get lastName(): string { return this._raw.lastName; }

  /**
   * Revoke All User Refresh Tokens
   * 
   * This method will revoke all refresh tokens under this specific user.
   * Once revoked, they will no longer be capible of using an existing refresh
   * token to generate a new authentication token, thus requiring them to login
   * again.
   * 
   * @returns - User Object
   */
  async revokeAllRefreshTokens() {
    await prismaInstance.userRefreshToken.deleteMany({
      where: {
        userId: this.id
      }
    });
    return;
  }

  /**
   * Update User Email Address.
   * 
   * @param email - The new email you'd like to apply to this user.
   * @returns - Updated user Object
   */
  async updateEmail(email: string): Promise<this> {
    await prismaInstance.user.update({
      data: { email },
      where: { id: this.id }
    });

    this._raw.email = email;
    return this;
  }

  /**
   * Update User Password
   * 
   * @param password - The new password to be applied to user (raw text)
   * @returns - Updated User Object
   */
  async updatePassword(password: string): Promise<this> {
    const newHash = Password.hash(password);

    await prismaInstance.user.update({
      data: {
        password: newHash
      },
      where: {
        id: this.id
      }
    });

    this._raw.password = newHash;
    return this;
  }

  /**
   * Validate User Password
   * 
   * This method will simply take an input string and check to see if it matches
   * the users password.
   * 
   * @param password - The password you'd like to validate
   * @returns - Weather the password is valid or not.
   */
  validatePassowrd(password: string): boolean {
    return Password.validate(password, this._raw.password ?? "");
  }

  /**
   * Get plain user object.
   * @returns - JSON Object reflecting user data.
   */
  toJson() {
    return {
      id: this.id,
      email: this.email,
      created: this.created,
      firstName: this.firstName,
      lastName: this.lastName
    }
  }
}