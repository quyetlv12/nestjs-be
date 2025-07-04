import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1751639129046 implements MigrationInterface {
    name = 'Init1751639129046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "slug" character varying, "thumbnail" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "parentId" integer, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "content" text NOT NULL, "userId" integer NOT NULL, "star" integer NOT NULL, "talentId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "videos" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "videoLink" character varying NOT NULL, "duration" character varying NOT NULL, "createdById" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "thumbnailLink" character varying, "hide_video" boolean, "price" integer, CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_video_protocol_method_enum" AS ENUM('7days', '24hours')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_recipient_enum" AS ENUM('someone_else', 'myself')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'cancelled', 'paid', 'processing', 'sent_video', 'completed', 'complaint', 'resolving', 'refunded', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "type" character varying(100) NOT NULL, "email" character varying(255), "video_protocol_method" "public"."orders_video_protocol_method_enum" NOT NULL DEFAULT '24hours', "talentId" integer NOT NULL, "recipient" "public"."orders_recipient_enum" NOT NULL DEFAULT 'someone_else', "for_gender" character varying(20), "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', "price" numeric(10,2) NOT NULL, "paymentMethod" character varying(50), "paymentDate" TIMESTAMP, "request_details" text NOT NULL, "example_video_link" character varying(500), "video_from" character varying(255), "video_from_gender" character varying(20), "hide_video_from" boolean DEFAULT false, "video_link" character varying(500), "userId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('SUCCESS', 'FAILED', 'REFUNDED', 'HOLDING')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_method_enum" AS ENUM('BANK_TRANSFER', 'CREDIT_CARD', 'MOMO', 'ZALOPAY', 'VNPAY', 'PAYPAL', 'CASH', 'SEPAY')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'VND', "status" "public"."payment_status_enum" NOT NULL, "method" "public"."payment_method_enum" NOT NULL, "transactionId" character varying(255) NOT NULL, "description" text, "metadata" json, "userId" integer NOT NULL, "talentId" integer NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'inactive', 'pending')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "phone" character varying, "business_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "availableFor24hDelivery" boolean NOT NULL DEFAULT false, "description" text, "avatar" character varying, "tags" json, "price" integer, "job" character varying, "address" character varying, "nick_name" character varying NOT NULL, "status" "public"."user_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_878678f951ec57decddec263213" UNIQUE ("nick_name"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."complaints_status_enum" AS ENUM('pending', 'investigating', 'resolved', 'rejected')`);
        await queryRunner.query(`CREATE TYPE "public"."complaints_priority_enum" AS ENUM('low', 'medium', 'high', 'urgent')`);
        await queryRunner.query(`CREATE TYPE "public"."complaints_complainttype_enum" AS ENUM('video_quality', 'delivery_time', 'content_issue', 'payment_issue', 'other')`);
        await queryRunner.query(`CREATE TABLE "complaints" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" text NOT NULL, "status" "public"."complaints_status_enum" NOT NULL DEFAULT 'pending', "priority" "public"."complaints_priority_enum" NOT NULL DEFAULT 'medium', "complaintType" "public"."complaints_complainttype_enum" NOT NULL, "evidence" json, "resolution" text, "resolvedAt" TIMESTAMP, "userId" integer NOT NULL, "orderId" integer, "videoId" integer, "resolvedBy" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4b7566a2a489c2cc7c12ed076ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."chat_messages_type_enum" AS ENUM('text', 'image', 'file')`);
        await queryRunner.query(`CREATE TABLE "chat_messages" ("id" SERIAL NOT NULL, "chatId" integer NOT NULL, "senderId" integer NOT NULL, "type" "public"."chat_messages_type_enum" NOT NULL DEFAULT 'text', "content" text, "imageUrl" character varying, "fileName" character varying, "fileUrl" character varying, "isRead" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chats" ("id" SERIAL NOT NULL, "participant1_id" integer NOT NULL, "participant2_id" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`CREATE TABLE "user_categories" ("user_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_802a1731c44150d3e7e30ea75c2" PRIMARY KEY ("user_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_45435150cf9c026d714c9d847e" ON "user_categories" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_78d822ee1ebeb703dbecdf8e61" ON "user_categories" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_6f40a4f3044999ff69148e1619a" FOREIGN KEY ("talentId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_ee0f586602250457165051fbd96" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_3af58df2224710666bd2efdef93" FOREIGN KEY ("talentId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_6dc957573d80b08119004232bf1" FOREIGN KEY ("talentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "complaints" ADD CONSTRAINT "FK_4b5fb19c320cd50b6e4faf998a9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "complaints" ADD CONSTRAINT "FK_cac0c60efb829c91a09565fcc51" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "complaints" ADD CONSTRAINT "FK_f82266c3b8bf26c9692d79523e6" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "complaints" ADD CONSTRAINT "FK_900c7445286e16d1c39a0eb545f" FOREIGN KEY ("resolvedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_e82334881c89c2aef308789c8be" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_fc6b58e41e9a871dacbe9077def" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_4dd9dd0d81fb5493fbd25c79b6f" FOREIGN KEY ("participant1_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_83bd20f7c03e2972a69d9e9422e" FOREIGN KEY ("participant2_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_categories" ADD CONSTRAINT "FK_45435150cf9c026d714c9d847e6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_categories" ADD CONSTRAINT "FK_78d822ee1ebeb703dbecdf8e616" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_categories" DROP CONSTRAINT "FK_78d822ee1ebeb703dbecdf8e616"`);
        await queryRunner.query(`ALTER TABLE "user_categories" DROP CONSTRAINT "FK_45435150cf9c026d714c9d847e6"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_83bd20f7c03e2972a69d9e9422e"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_4dd9dd0d81fb5493fbd25c79b6f"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_fc6b58e41e9a871dacbe9077def"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_e82334881c89c2aef308789c8be"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_900c7445286e16d1c39a0eb545f"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_f82266c3b8bf26c9692d79523e6"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_cac0c60efb829c91a09565fcc51"`);
        await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_4b5fb19c320cd50b6e4faf998a9"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_6dc957573d80b08119004232bf1"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_3af58df2224710666bd2efdef93"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_ee0f586602250457165051fbd96"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_6f40a4f3044999ff69148e1619a"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78d822ee1ebeb703dbecdf8e61"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_45435150cf9c026d714c9d847e"`);
        await queryRunner.query(`DROP TABLE "user_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "chats"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
        await queryRunner.query(`DROP TYPE "public"."chat_messages_type_enum"`);
        await queryRunner.query(`DROP TABLE "complaints"`);
        await queryRunner.query(`DROP TYPE "public"."complaints_complainttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."complaints_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."complaints_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_recipient_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_video_protocol_method_enum"`);
        await queryRunner.query(`DROP TABLE "videos"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
