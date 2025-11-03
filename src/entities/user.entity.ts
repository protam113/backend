import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Document } from 'mongoose';
import { Base } from './base.entity';
import { COLLECTION_KEYS } from 'src/database/collections';
import { Role } from 'src/common/enums/role.enum';

@Schema({ timestamps: true })
export class UserEntity extends Base {
  @Prop({ trim: true })
  fullName: string;

  @Prop()
  readonly role!: Role;

  @Prop({ unique: true })
  readonly username!: string;

  @Prop({ unique: true, trim: true, lowercase: true })
  readonly email: string;

  @Prop({ required: false, select: false })
  password?: string;

}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
UserSchema.set('collection', COLLECTION_KEYS.USER);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await argon2.hash(this.password);
  }
  next();
});

UserSchema.methods.comparePassword = async function (
  attempt: string
): Promise<boolean> {
  if (!attempt || !this.password) return false;
  return argon2.verify(this.password, attempt);
};

export interface UserDocument extends Document {
  _id: string;
  avatarUrl?: string;
  username?: string;
  email: string;
  password?: string;
  fullName: string;
  role: Role;
  comparePassword(attempt: string): Promise<boolean>;
}

