import { Column, Entity } from "typeorm";
import { BaseTable } from "./BaseTable";

@Entity()
export class WebhookResponse extends BaseTable {

  @Column({ type: 'json' })
  public response: object;

  @Column({ type: 'json' })
  public metadata: object;

  build({ response, metadata, is_active }: Partial<WebhookResponse>): WebhookResponse {
    super.build({ is_active });
    this.response = response;
    this.metadata = metadata;
    return this;
  }
}