import Collection from '@discordjs/collection';
import type { APIModalSubmission, ModalSubmitComponent } from 'discord-api-types/v10';

class ModalFields {
  data: APIModalSubmission;
  constructor(data?: APIModalSubmission) {
    this.data = data ?? {
      components: [],
      custom_id: '',
    };
  }

  get components() {
    return this.data.components;
  }

  get fields() {
    const collection = new Collection<string, ModalSubmitComponent>();
    if (!this.data.components) return collection;
    for (const field of this.data.components) {
      field.components.forEach(component => collection.set(component.custom_id, component));
    }
    return collection;
  }

  /** Gets a field given a custom id from a component */
  getField(id: string) {
    return this.fields.get(id);
  }

  /** Gets a field's value given a custom id from a component */
  getFieldValue(id: string) {
    const field = this.getField(id);
    return field?.value === '' ? undefined : field?.value;
  }
}

export { ModalFields };
