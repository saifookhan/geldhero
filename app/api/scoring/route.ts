import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Fetch all scoring matrix rows
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("scoring_matrix")
      .select("*")
      .order("factor_slug", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create a new scoring matrix row
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payload } = body;

    if (!payload) {
      return NextResponse.json(
        { error: "Payload is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("scoring_matrix")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH - Update a scoring matrix row
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, payload } = body;

    if (!id || !payload) {
      return NextResponse.json(
        { error: "ID and payload are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("scoring_matrix")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a scoring matrix row
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("scoring_matrix")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
