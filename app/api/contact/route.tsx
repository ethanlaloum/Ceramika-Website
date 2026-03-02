import React from "react";
import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, subject, message } = body;

    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    // send an email to site owner with the contact details
    const { data, error } = await resend.emails.send({
      from: "Ceramika <noreply@mail.cerami-ka.com>",
      to: "contact@cerami-ka.com", // replace with actual admin address
      subject: `[Contact] ${subject}`,
      react: (
        <>
          <p>Vous avez reçu un nouveau message de la page de contact :</p>
          <p><strong>Nom&nbsp;:</strong> {fullName}</p>
          <p><strong>Email&nbsp;:</strong> {email}</p>
          {phone && <p><strong>Téléphone&nbsp;:</strong> {phone}</p>}
          <p><strong>Message&nbsp;:</strong></p>
          <p>{message}</p>
        </>
      ),
    });

    if (error) {
      console.error("Resend error (contact)", error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Contact API error", err);
    return NextResponse.json({ success: false, error: "Unexpected error" }, { status: 500 });
  }
}
