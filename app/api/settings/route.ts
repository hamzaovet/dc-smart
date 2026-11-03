import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "dcsmart_settings" },
    });

    if (!settings) {
      settings = await prisma.storeSettings.findFirst();
    }

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: "dcsmart_settings",
          storeNameAr: "دي سي سمارت — للأنظمة الأمنية والتحكم الذكي",
          storeNameEn: "DC Smart — Smart Security & Technology Solutions",
          whatsappPhone: "01281248731",
          hotline: "01008657085",
          secondaryPhone: "01007302685",
          googleMapsUrl: "https://maps.google.com/?q=Tanta,Gharbia,Egypt",
          addressAr: "طنطا — محافظة الغربية — جمهورية مصر العربية",
          addressEn: "Tanta, Gharbia Governorate, Egypt",
          workingHoursAr: "يومياً من 9:00 صباحاً حتى 11:00 مساءً",
          workingHoursEn: "Daily from 9:00 AM to 11:00 PM",
          instagramHandle: "dcsmart.cctv",
          announcementAr: "🛡️ ضمان عامين شامل استبدال فوري لكافة كاميرات المراقبة وأجهزة التسجيل + معاينة وتركيب احترافي",
          announcementEn: "🛡️ 2-Year Full Replacement Warranty on all CCTV Cameras & DVRs + Professional Installation",
          deliveryFee: 50.0,
          freeShippingThreshold: 5000.0,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع إعدادات المنظومة", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const updateData: any = {};
    if (body.storeNameAr !== undefined) updateData.storeNameAr = body.storeNameAr;
    if (body.storeNameEn !== undefined) updateData.storeNameEn = body.storeNameEn;
    if (body.taglineAr !== undefined) updateData.taglineAr = body.taglineAr;
    if (body.taglineEn !== undefined) updateData.taglineEn = body.taglineEn;
    if (body.whatsappPhone !== undefined) updateData.whatsappPhone = body.whatsappPhone.trim();
    if (body.hotline !== undefined) updateData.hotline = body.hotline.trim();
    if (body.secondaryPhone !== undefined) updateData.secondaryPhone = body.secondaryPhone.trim();
    if (body.googleMapsUrl !== undefined) updateData.googleMapsUrl = body.googleMapsUrl.trim();
    if (body.addressAr !== undefined) updateData.addressAr = body.addressAr;
    if (body.addressEn !== undefined) updateData.addressEn = body.addressEn;
    if (body.workingHoursAr !== undefined) updateData.workingHoursAr = body.workingHoursAr;
    if (body.workingHoursEn !== undefined) updateData.workingHoursEn = body.workingHoursEn;
    if (body.instagramHandle !== undefined) updateData.instagramHandle = body.instagramHandle.trim();
    if (body.announcementAr !== undefined) updateData.announcementAr = body.announcementAr;
    if (body.announcementEn !== undefined) updateData.announcementEn = body.announcementEn;
    if (body.deliveryFee !== undefined) updateData.deliveryFee = Number(body.deliveryFee);
    if (body.freeShippingThreshold !== undefined) {
      updateData.freeShippingThreshold = Number(body.freeShippingThreshold);
    }

    const current = await prisma.storeSettings.findFirst();
    const targetId = current ? current.id : "dcsmart_settings";

    const settings = await prisma.storeSettings.upsert({
      where: { id: targetId },
      update: updateData,
      create: {
        id: targetId,
        storeNameAr: "دي سي سمارت — للأنظمة الأمنية والتحكم الذكي",
        storeNameEn: "DC Smart — Smart Security & Technology Solutions",
        whatsappPhone: "01281248731",
        hotline: "01008657085",
        secondaryPhone: "01007302685",
        ...updateData,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل حفظ إعدادات المنظومة", details: error.message },
      { status: 500 }
    );
  }
}
