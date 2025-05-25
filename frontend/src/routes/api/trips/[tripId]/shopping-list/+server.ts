import { json } from '@sveltejs/kit';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getShoppingList } from '$lib/server/db';

export async function GET({ params }: { params: { tripId: string } }) {
  const { tripId } = params;
  const shoppingList = await getShoppingList(tripId);

  if (!shoppingList) {
    return json({ error: 'Shopping list not found' }, { status: 404 });
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText('Liste de courses', {
    x: 50,
    y: 750,
    size: 24,
    font: font,
    color: rgb(0, 0, 0),
  });

  let y = 700;
  shoppingList.forEach((item: { name: string; quantity: number }) => {
    page.drawText(`${item.name}: ${item.quantity}`, {
      x: 50,
      y: y,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
    y -= 20;
  });

  const pdfBytes = await pdfDoc.save();
  const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
  return json({ pdfData: pdfBase64 }, { status: 200 });
}