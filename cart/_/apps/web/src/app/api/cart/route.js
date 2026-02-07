import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const userId = 1; // Demo user ID - in production, get from auth session

    const cartItems = await sql`
      SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        i.id as item_id,
        i.name,
        i.description,
        i.price,
        i.image_url,
        i.rating,
        i.reviews,
        i.on_sale,
        i.sale_percent
      FROM cart_items ci
      JOIN items i ON ci.item_id = i.id
      WHERE ci.user_id = ${userId}
      ORDER BY ci.added_at DESC
    `;

    return Response.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// Add item to cart
export async function POST(request) {
  try {
    const userId = 1; // Demo user ID - in production, get from auth session
    const { itemId, quantity } = await request.json();

    if (!itemId || !quantity) {
      return Response.json(
        { error: "itemId and quantity are required" },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT id, quantity FROM cart_items
      WHERE user_id = ${userId} AND item_id = ${itemId}
    `;

    if (existingItem.length > 0) {
      // Update quantity if item already in cart
      const newQuantity = existingItem[0].quantity + quantity;
      await sql`
        UPDATE cart_items
        SET quantity = ${newQuantity}
        WHERE id = ${existingItem[0].id}
      `;
    } else {
      // Insert new cart item
      await sql`
        INSERT INTO cart_items (user_id, item_id, quantity)
        VALUES (${userId}, ${itemId}, ${quantity})
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return Response.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

// Update cart item quantity
export async function PUT(request) {
  try {
    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || quantity === undefined) {
      return Response.json(
        { error: "cartItemId and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return Response.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    await sql`
      UPDATE cart_items
      SET quantity = ${quantity}
      WHERE id = ${cartItemId}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating cart:", error);
    return Response.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

// Remove item from cart
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const cartItemId = url.searchParams.get("cartItemId");

    if (!cartItemId) {
      return Response.json(
        { error: "cartItemId is required" },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM cart_items
      WHERE id = ${cartItemId}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return Response.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}