import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChatTables1750600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create chats table
    await queryRunner.createTable(
      new Table({
        name: 'chats',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'participant1_id',
            type: 'int',
          },
          {
            name: 'participant2_id',
            type: 'int',
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create chat_messages table
    await queryRunner.createTable(
      new Table({
        name: 'chat_messages',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'chat_id',
            type: 'int',
          },
          {
            name: 'sender_id',
            type: 'int',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['text', 'image', 'file'],
            default: "'text'",
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'image_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'file_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'file_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_read',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign keys for chats table
    try {
      await queryRunner.createForeignKey(
        'chats',
        new TableForeignKey({
          columnNames: ['participant1_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'CASCADE',
        }),
      );
    } catch (error) {
      console.log('Foreign key participant1_id already exists');
    }

    try {
      await queryRunner.createForeignKey(
        'chats',
        new TableForeignKey({
          columnNames: ['participant2_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'CASCADE',
        }),
      );
    } catch (error) {
      console.log('Foreign key participant2_id already exists');
    }

    // Add foreign keys for chat_messages table
    try {
      await queryRunner.createForeignKey(
        'chat_messages',
        new TableForeignKey({
          columnNames: ['chat_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'chats',
          onDelete: 'CASCADE',
        }),
      );
    } catch (error) {
      console.log('Foreign key chat_id already exists');
    }

    try {
      await queryRunner.createForeignKey(
        'chat_messages',
        new TableForeignKey({
          columnNames: ['sender_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'CASCADE',
        }),
      );
    } catch (error) {
      console.log('Foreign key sender_id already exists');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const chatMessagesTable = await queryRunner.getTable('chat_messages');
    if (chatMessagesTable) {
      const chatMessagesForeignKeys = chatMessagesTable.foreignKeys;
      for (const foreignKey of chatMessagesForeignKeys) {
        await queryRunner.dropForeignKey('chat_messages', foreignKey);
      }
    }

    const chatsTable = await queryRunner.getTable('chats');
    if (chatsTable) {
      const chatsForeignKeys = chatsTable.foreignKeys;
      for (const foreignKey of chatsForeignKeys) {
        await queryRunner.dropForeignKey('chats', foreignKey);
      }
    }

    // Drop tables
    await queryRunner.dropTable('chat_messages');
    await queryRunner.dropTable('chats');
  }
} 