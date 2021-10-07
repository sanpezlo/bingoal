import { SchemaOptions } from '@nestjs/mongoose';

export const timestamps = {
  createdAt: 'created_at' as const,
  updatedAt: 'updated_at' as const,
};

export const schemaOptions: SchemaOptions = {
  versionKey: false,
  timestamps: timestamps,
};
