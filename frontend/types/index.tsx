export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    date: string; // Or Date if you want to use JavaScript Date objects
    status: string; // Enum can be used for predefined statuses
    total: number;
    items: OrderItem[];
    provider: string;
}
