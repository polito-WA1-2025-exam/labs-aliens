// Constructor function for Establishment
function Establishment(id, name, address, phone, category) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.category = category;
}

// Constructor function for Bag
function Bag(id, type, content, price, size, establishmentId, pickupTime) {
    this.id = id;
    this.type = type; // "surprise" or "regular"
    this.content = content; 
    this.price = price;
    this.size = size; 
    this.establishmentId = establishmentId;
    this.pickupTime = pickupTime;
    this.state = "Available"; // "Available" or "Reserved"
}

// Container for managing bags
function BagCollection() {
    this.bags = [];

    this.addBag = function (bag) {
        this.bags.push(bag);
    };

    this.getBagsByEstablishment = function (establishmentId) {
        return this.bags.filter(bag => bag.establishmentId === establishmentId);
    };

    this.sortBagsByPrice = function () {
        this.bags.sort((a, b) => a.price - b.price);
    };

    this.reserveBag = function (bagId) {
        const bag = this.bags.find(bag => bag.id === bagId);
        if (bag && bag.state === "Available") {
            bag.state = "Reserved";
            return true;
        }
        return false;
    };

    this.deleteBag = function (bagId) {
        this.bags = this.bags.filter(bag => bag.id !== bagId);
    };
}

// Sample Data
const bagCollection = new BagCollection();
bagCollection.addBag(new Bag(1, "surprise", null, 5, "small", 101, dayjs("2025-04-01 18:00").format("YYYY-MM-DD HH:mm")));
bagCollection.addBag(new Bag(2, "regular", [{ name: "Apple", quantity: 2 }, { name: "Banana", quantity: 1 }], 8, "medium", 102, dayjs("2025-04-02 12:00").format("YYYY-MM-DD HH:mm")));
bagCollection.addBag(new Bag(3, "surprise", null, 6, "large", 101, "2025-04-01 20:00"));
bagCollection.addBag(new Bag(4, "regular", [{ name: "Pasta", quantity: 1 }], 10, "small", 103, dayjs("2025-04-03 14:00").format("YYYY-MM-DD HH:mm")));
bagCollection.addBag(new Bag(5, "regular", [{ name: "Bread", quantity: 3 }], 7, "medium", 102, dayjs("2025-04-02 15:00").format("YYYY-MM-DD HH:mm")));

// Display sorted bags
bagCollection.sortBagsByPrice();
console.log("Sorted Bags by Price:", bagCollection.bags);

// Reserving a bag
console.log("Reserving bag 2:", bagCollection.reserveBag(2));
console.log("Updated Bags:", bagCollection.bags);

// Deleting a bag
bagCollection.deleteBag(3);
console.log("After Deleting Bag 3:", bagCollection.bags);
