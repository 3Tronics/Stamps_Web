var price = 0;
var total = 0;

const cartOperations = {
    itemList: [],
    add(currentobject) {
        this.itemList.push(currentobject);
    },

    calcPrice(totalprice) {
        var number = Number(totalprice.replace(/[^0-9.-]+/g,""));
        return price =  price + number;
    },
    
    calcCartSubtotal(cartprice) {        
       
        return total = cartprice + (cartprice * tax);
    },

    deleteItem() {
        return this.itemList.splice(0, this.itemList.length);
    }
}