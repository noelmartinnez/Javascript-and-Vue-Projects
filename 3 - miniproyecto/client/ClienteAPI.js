const BASE_URL = "http://localhost:3000/items";

export class ClienteAPI {
  async getItems() {
    const resp = await fetch(BASE_URL);
    if (resp.ok) {
      return resp.json();
    } else {
      throw new Error(resp);
    }
  }

  async toggleItem(id, valor) {
    const resp = await fetch(BASE_URL + "/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comprado: valor }),
    });
    if (resp.ok) {
      return true;
    } else {
      throw new Error(resp);
    }
  }

  async deleteItem(id) {
    const resp = await fetch(BASE_URL + "/" + id, {
      method: "DELETE",
    });

    if (resp.ok) {
      return true;
    } else {
      throw new Error(resp);
    }
  }

  async addItem(item) {
    const resp = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (resp.ok) {
      return resp.json();
    } else {
      throw new Error(resp);
    }
  }
}
