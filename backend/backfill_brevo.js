import mongoose from "mongoose";
import "dotenv/config";
import bookingModel from "./models/bookingsModel.js";

const csvData = `First opening,14-04-2026 01:27:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ameyabobade007@gmail.com,NA,<b0a7a9a4-403b-c51c-ccc2-3f290e524246@gmail.com>,NA
Opened,13-04-2026 23:52:48,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,manasvi.puri_comp25@pccoer.in,NA,<c233f17e-6a87-11c9-9e08-5c5bdc80ae7b@gmail.com>,NA
First opening,13-04-2026 23:52:31,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,manasvi.puri_comp25@pccoer.in,NA,<c233f17e-6a87-11c9-9e08-5c5bdc80ae7b@gmail.com>,NA
Delivered,13-04-2026 23:52:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,manasvi.puri_comp25@pccoer.in,NA,<c233f17e-6a87-11c9-9e08-5c5bdc80ae7b@gmail.com>,NA
Sent,13-04-2026 23:52:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,manasvi.puri_comp25@pccoer.in,NA,<c233f17e-6a87-11c9-9e08-5c5bdc80ae7b@gmail.com>,NA
Delivered,13-04-2026 23:41:35,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ameyabobade007@gmail.com,NA,<b0a7a9a4-403b-c51c-ccc2-3f290e524246@gmail.com>,NA
Sent,13-04-2026 23:41:33,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ameyabobade007@gmail.com,NA,<b0a7a9a4-403b-c51c-ccc2-3f290e524246@gmail.com>,NA
Opened,13-04-2026 22:20:27,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryan.kadam_civil25@pccoer.in,NA,<742f8b98-043d-4a9a-91c3-cb152223d26a@gmail.com>,NA
First opening,13-04-2026 22:20:27,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryan.kadam_civil25@pccoer.in,NA,<fafe9e8b-a54c-7e59-2b7f-30d4ff605eb2@gmail.com>,NA
Sent,13-04-2026 22:11:48,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,jiyaramdhave2007@gmail.com,NA,<7737c93d-7b61-0db2-fb1a-93e4b17ba93a@gmail.com>,NA
Soft bounce,13-04-2026 22:11:48,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,jiyaramdhave2007@gmail.com,NA,<7737c93d-7b61-0db2-fb1a-93e4b17ba93a@gmail.com>,NA
Delivered,13-04-2026 22:08:43,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,siddhesh.akole_it24@pccoer.in,NA,<07c566f9-1535-eff4-18c0-77247fd2ec3d@gmail.com>,NA
Sent,13-04-2026 22:08:40,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,siddhesh.akole_it24@pccoer.in,NA,<07c566f9-1535-eff4-18c0-77247fd2ec3d@gmail.com>,NA
Opened,13-04-2026 21:35:06,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sahilmane981@gmail.com,NA,<8a50e455-0b0e-e910-3d9b-2dd065620b38@gmail.com>,NA
First opening,13-04-2026 21:34:08,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sahilmane981@gmail.com,NA,<b0008587-cd53-d9f8-b6fd-5009a4f26a2c@gmail.com>,NA
Delivered,13-04-2026 21:33:55,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sahilmane981@gmail.com,NA,<b0008587-cd53-d9f8-b6fd-5009a4f26a2c@gmail.com>,NA
Sent,13-04-2026 21:33:49,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sahilmane981@gmail.com,NA,<b0008587-cd53-d9f8-b6fd-5009a4f26a2c@gmail.com>,NA
Clicked,13-04-2026 20:52:49,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,asatpute2408@gmail.com,NA,<6b92cbd9-cede-088b-4d80-80d782de5c69@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Opened,13-04-2026 20:52:36,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,asatpute2408@gmail.com,NA,<6b92cbd9-cede-088b-4d80-80d782de5c69@gmail.com>,NA
Delivered,13-04-2026 20:51:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,asatpute2408@gmail.com,NA,<6b92cbd9-cede-088b-4d80-80d782de5c69@gmail.com>,NA
Sent,13-04-2026 20:50:59,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,asatpute2408@gmail.com,NA,<6b92cbd9-cede-088b-4d80-80d782de5c69@gmail.com>,NA
Opened,13-04-2026 20:43:06,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,rahulmach2007@gmail.com,NA,<34a71309-d965-dc57-e536-e141f13e4170@gmail.com>,NA
Opened,13-04-2026 20:42:11,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,rahulmach2007@gmail.com,NA,<34a71309-d965-dc57-e536-e141f13e4170@gmail.com>,NA
Opened,13-04-2026 20:41:51,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,rahulmach2007@gmail.com,NA,<34a71309-d965-dc57-e536-e141f13e4170@gmail.com>,NA
Clicked,13-04-2026 20:41:40,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,rahulmach2007@gmail.com,NA,<34a71309-d965-dc57-e536-e141f13e4170@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,13-04-2026 20:41:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,rahulmach2007@gmail.com,NA,<34a71309-d965-dc57-e536-e141f13e4170@gmail.com>,NA
Delivered,13-04-2026 20:41:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,rahulmach2007@gmail.com,NA,<34a71309-d965-dc57-e536-e141f13e4170@gmail.com>,NA
Sent,13-04-2026 20:41:18,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,rahulmach2007@gmail.com,NA,<34a71309-d965-dc57-e536-e141f13e4170@gmail.com>,NA
First opening,13-04-2026 19:48:36,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yugandharap02@gmail.com,NA,<287d8223-853a-5cf8-bee8-7711cde80239@gmail.com>,NA
Delivered,13-04-2026 19:47:14,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yugandharap02@gmail.com,NA,<287d8223-853a-5cf8-bee8-7711cde80239@gmail.com>,NA
Sent,13-04-2026 19:47:06,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yugandharap02@gmail.com,NA,<287d8223-853a-5cf8-bee8-7711cde80239@gmail.com>,NA
Delivered,13-04-2026 19:44:08,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ishwarishinde354@gmail.com,NA,<f78001d3-50ee-cfa9-2592-f7fc01aac643@gmail.com>,NA
Sent,13-04-2026 19:44:00,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ishwarishinde354@gmail.com,NA,<f78001d3-50ee-cfa9-2592-f7fc01aac643@gmail.com>,NA
Delivered,13-04-2026 18:41:46,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vikaspandhare2005@gmail.com,NA,<1991fa11-54f6-1f53-ff2e-1c65e3f794f4@gmail.com>,NA
Sent,13-04-2026 18:41:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vikaspandhare2005@gmail.com,NA,<1991fa11-54f6-1f53-ff2e-1c65e3f794f4@gmail.com>,NA
Clicked,13-04-2026 18:38:20,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,adwaitdeshmukh23@gmail.com,NA,<bc80edd2-a67e-c3d3-70e4-b850802ab30c@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,13-04-2026 18:38:17,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,adwaitdeshmukh23@gmail.com,NA,<bc80edd2-a67e-c3d3-70e4-b850802ab30c@gmail.com>,NA
Delivered,13-04-2026 18:34:12,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,adwaitdeshmukh23@gmail.com,NA,<bc80edd2-a67e-c3d3-70e4-b850802ab30c@gmail.com>,NA
Sent,13-04-2026 18:33:30,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,adwaitdeshmukh23@gmail.com,NA,<bc80edd2-a67e-c3d3-70e4-b850802ab30c@gmail.com>,NA
Clicked,13-04-2026 18:25:30,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,chandan.shinde_entc24@pccoer.in,NA,<6a6e5c02-c48c-e01e-005f-3f58804499b1@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,13-04-2026 18:25:16,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,chandan.shinde_entc24@pccoer.in,NA,<6a6e5c02-c48c-e01e-005f-3f58804499b1@gmail.com>,NA
Delivered,13-04-2026 18:20:07,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,chandan.shinde_entc24@pccoer.in,NA,<6a6e5c02-c48c-e01e-005f-3f58804499b1@gmail.com>,NA
Sent,13-04-2026 18:20:04,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,chandan.shinde_entc24@pccoer.in,NA,<6a6e5c02-c48c-e01e-005f-3f58804499b1@gmail.com>,NA
First opening,13-04-2026 18:08:11,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<7d2aff7c-feac-71af-dee7-860478f596e5@gmail.com>,NA
Delivered,13-04-2026 18:08:00,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<7d2aff7c-feac-71af-dee7-860478f596e5@gmail.com>,NA
Sent,13-04-2026 18:07:53,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<7d2aff7c-feac-71af-dee7-860478f596e5@gmail.com>,NA
Soft bounce,13-04-2026 17:10:24,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,jagtapprasad21@gmail.com,NA,<864b606f-b92d-1867-799d-9152f0066c24@gmail.com>,NA
Sent,13-04-2026 17:10:22,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,jagtapprasad21@gmail.com,NA,<864b606f-b92d-1867-799d-9152f0066c24@gmail.com>,NA
Delivered,13-04-2026 16:41:14,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sarthakwagh107@gmail.com,NA,<29871ac0-f99d-9aaf-14d9-b45dbc6f27de@gmail.com>,NA
Sent,13-04-2026 16:41:06,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sarthakwagh107@gmail.com,NA,<29871ac0-f99d-9aaf-14d9-b45dbc6f27de@gmail.com>,NA
Opened,13-04-2026 15:42:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<0a12e3da-36d0-d624-47c5-bd3b96b1b1a7@gmail.com>,NA
Opened,13-04-2026 15:16:17,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,NA
Clicked,13-04-2026 15:07:32,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashashreegunjal30@gmail.com,NA,<b3fbde0d-42fb-9aaf-25bc-e91ec0d37ef2@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,13-04-2026 15:07:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashashreegunjal30@gmail.com,NA,<b3fbde0d-42fb-9aaf-25bc-e91ec0d37ef2@gmail.com>,NA
Delivered,13-04-2026 15:03:15,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashashreegunjal30@gmail.com,NA,<b3fbde0d-42fb-9aaf-25bc-e91ec0d37ef2@gmail.com>,NA
Sent,13-04-2026 15:03:07,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashashreegunjal30@gmail.com,NA,<b3fbde0d-42fb-9aaf-25bc-e91ec0d37ef2@gmail.com>,NA
Clicked,13-04-2026 14:59:27,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Clicked,13-04-2026 14:44:13,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Opened,13-04-2026 14:43:53,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,NA
Clicked,13-04-2026 14:43:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Clicked,13-04-2026 14:42:09,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Clicked,13-04-2026 14:41:56,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Clicked,13-04-2026 14:41:46,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Opened,13-04-2026 14:41:40,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,NA
First opening,13-04-2026 14:41:28,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,NA
Delivered,13-04-2026 14:41:09,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,NA
Sent,13-04-2026 14:41:01,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kalpakpatil2004@gmail.com,NA,<49c4419f-c694-db3a-a35b-77e53f4cb978@gmail.com>,NA
Delivered,13-04-2026 14:34:32,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ranadeaditya24@gmail.com,NA,<cb81df6a-92cd-8821-ee48-db9a9d59b88e@gmail.com>,NA
Sent,13-04-2026 14:34:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ranadeaditya24@gmail.com,NA,<cb81df6a-92cd-8821-ee48-db9a9d59b88e@gmail.com>,NA
Delivered,13-04-2026 14:06:44,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,riddhidattanuja@gmail.com,NA,<dca5e5b1-61f9-0039-df6b-d26e63c5dc71@gmail.com>,NA
Sent,13-04-2026 14:06:36,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,riddhidattanuja@gmail.com,NA,<dca5e5b1-61f9-0039-df6b-d26e63c5dc71@gmail.com>,NA
Opened,13-04-2026 13:16:49,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,NA
First opening,13-04-2026 13:01:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vardhanm1305@gmail.com,NA,<c15038ef-6318-f8ca-473a-cf06e11a0dbb@gmail.com>,NA
Delivered,13-04-2026 12:59:33,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vardhanm1305@gmail.com,NA,<c15038ef-6318-f8ca-473a-cf06e11a0dbb@gmail.com>,NA
Sent,13-04-2026 12:59:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vardhanm1305@gmail.com,NA,<c15038ef-6318-f8ca-473a-cf06e11a0dbb@gmail.com>,NA
Clicked,13-04-2026 12:53:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,krishbhavsar2107@gmail.com,NA,<2cb46e27-9ce2-a889-4133-6a32dce2b5b9@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,13-04-2026 12:53:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,krishbhavsar2107@gmail.com,NA,<2cb46e27-9ce2-a889-4133-6a32dce2b5b9@gmail.com>,NA
Clicked,13-04-2026 12:53:13,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkarbhujbal9891@gmail.com,NA,<5faa94a5-5e89-83b6-4ee0-d13797872baf@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,13-04-2026 12:53:02,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkarbhujbal9891@gmail.com,NA,<5faa94a5-5e89-83b6-4ee0-d13797872baf@gmail.com>,NA
Opened,13-04-2026 12:50:55,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,NA
Clicked,13-04-2026 12:48:28,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Opened,13-04-2026 12:48:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,NA
Opened,13-04-2026 12:48:01,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,NA
Opened,13-04-2026 12:47:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,NA
Clicked,13-04-2026 12:47:28,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Clicked,13-04-2026 12:47:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Opened,13-04-2026 12:47:16,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,NA
First opening,13-04-2026 12:46:48,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,NA
Delivered,13-04-2026 12:46:40,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,NA
Sent,13-04-2026 12:46:31,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kashishchitriv8@gmail.com,NA,<c0dbfc6b-225e-b586-0de7-8af81709e16e@gmail.com>,NA
Opened,13-04-2026 12:43:09,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<84f4ee45-a836-2c25-9e18-16c65099b022@gmail.com>,NA
Delivered,13-04-2026 12:39:08,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkarbhujbal9891@gmail.com,NA,<5faa94a5-5e89-83b6-4ee0-d13797872baf@gmail.com>,NA
Sent,13-04-2026 12:38:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkarbhujbal9891@gmail.com,NA,<5faa94a5-5e89-83b6-4ee0-d13797872baf@gmail.com>,NA
Opened,13-04-2026 12:35:30,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,dev.kumarrom@gmail.com,NA,<fe5543fc-47a9-6609-225c-96cf08961837@gmail.com>,NA
Delivered,13-04-2026 12:32:05,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,krishbhavsar2107@gmail.com,NA,<2cb46e27-9ce2-a889-4133-6a32dce2b5b9@gmail.com>,NA
Sent,13-04-2026 12:30:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,krishbhavsar2107@gmail.com,NA,<2cb46e27-9ce2-a889-4133-6a32dce2b5b9@gmail.com>,NA
Opened,13-04-2026 11:10:08,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,dev.kumarrom@gmail.com,NA,<fe5543fc-47a9-6609-225c-96cf08961837@gmail.com>,NA
Opened,13-04-2026 11:03:54,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Opened,13-04-2026 10:04:11,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,dev.kumarrom@gmail.com,NA,<fe5543fc-47a9-6609-225c-96cf08961837@gmail.com>,NA
Clicked,13-04-2026 08:54:34,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,anushka.patil_comp25@pccoer.in,NA,<9846f3eb-8aa1-01de-0a14-5e7254c8d609@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,13-04-2026 08:54:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,anushka.patil_comp25@pccoer.in,NA,<9846f3eb-8aa1-01de-0a14-5e7254c8d609@gmail.com>,NA
Delivered,13-04-2026 08:54:20,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,anushka.patil_comp25@pccoer.in,NA,<9846f3eb-8aa1-01de-0a14-5e7254c8d609@gmail.com>,NA
Sent,13-04-2026 08:54:11,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,anushka.patil_comp25@pccoer.in,NA,<9846f3eb-8aa1-01de-0a14-5e7254c8d609@gmail.com>,NA
Clicked,13-04-2026 00:03:32,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,survearyanamol27@gmail.com,NA,<3952790e-9c2f-b0c0-ddee-e9fb039bde10@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,13-04-2026 00:03:22,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,survearyanamol27@gmail.com,NA,<1753758d-a83a-b0be-55ed-9933813f1afc@gmail.com>,NA
First opening,13-04-2026 00:03:21,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,survearyanamol27@gmail.com,NA,<3952790e-9c2f-b0c0-ddee-e9fb039bde10@gmail.com>,NA
Clicked,13-04-2026 00:03:15,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,saivaradgadappa44@gmail.com,NA,<e9fbf669-6d3f-f08d-db6c-3b2a7b3efded@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Clicked,13-04-2026 00:03:02,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,saivaradgadappa44@gmail.com,NA,<e9fbf669-6d3f-f08d-db6c-3b2a7b3efded@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Opened,13-04-2026 00:02:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Opened,13-04-2026 00:02:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Opened,13-04-2026 00:02:39,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<320fcd32-1892-62b5-7bdc-faca37769624@gmail.com>,NA
Opened,13-04-2026 00:02:39,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Delivered,12-04-2026 23:15:34,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,saivaradgadappa44@gmail.com,NA,<e9fbf669-6d3f-f08d-db6c-3b2a7b3efded@gmail.com>,NA
Sent,12-04-2026 23:15:32,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,saivaradgadappa44@gmail.com,NA,<e9fbf669-6d3f-f08d-db6c-3b2a7b3efded@gmail.com>,NA
Clicked,12-04-2026 22:26:00,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,dev.kumarrom@gmail.com,NA,<fe5543fc-47a9-6609-225c-96cf08961837@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,12-04-2026 22:24:33,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,dev.kumarrom@gmail.com,NA,<fe5543fc-47a9-6609-225c-96cf08961837@gmail.com>,NA
Delivered,12-04-2026 22:24:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,dev.kumarrom@gmail.com,NA,<fe5543fc-47a9-6609-225c-96cf08961837@gmail.com>,NA
Sent,12-04-2026 22:24:16,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,dev.kumarrom@gmail.com,NA,<fe5543fc-47a9-6609-225c-96cf08961837@gmail.com>,NA
Clicked,12-04-2026 19:23:08,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Clicked,12-04-2026 19:23:04,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Opened,12-04-2026 19:22:54,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
First opening,12-04-2026 19:10:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sankalptathe007@gmail.com,NA,<23fd8198-7181-cfc6-9b39-ddc243878335@gmail.com>,NA
Delivered,12-04-2026 19:10:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sankalptathe007@gmail.com,NA,<23fd8198-7181-cfc6-9b39-ddc243878335@gmail.com>,NA
Sent,12-04-2026 19:10:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sankalptathe007@gmail.com,NA,<23fd8198-7181-cfc6-9b39-ddc243878335@gmail.com>,NA
Delivered,12-04-2026 18:58:59,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<a700e99e-6b6e-1ce9-69a7-080f439823ed@gmail.com>,NA
Sent,12-04-2026 18:58:57,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<a700e99e-6b6e-1ce9-69a7-080f439823ed@gmail.com>,NA
First opening,12-04-2026 18:51:57,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,anupkulkarniofficial@gmail.com,NA,<1707795f-910b-7535-be61-9d64d27b2fd1@gmail.com>,NA
Delivered,12-04-2026 18:51:49,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,anupkulkarniofficial@gmail.com,NA,<1707795f-910b-7535-be61-9d64d27b2fd1@gmail.com>,NA
Sent,12-04-2026 18:51:47,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,anupkulkarniofficial@gmail.com,NA,<1707795f-910b-7535-be61-9d64d27b2fd1@gmail.com>,NA
Clicked,12-04-2026 16:09:41,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkarhandore305@gmail.com,NA,<8d74d8a1-4a2f-4a43-2c47-022dc49f6585@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,12-04-2026 16:09:35,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkarhandore305@gmail.com,NA,<8d74d8a1-4a2f-4a43-2c47-022dc49f6585@gmail.com>,NA
Delivered,12-04-2026 16:09:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkarhandore305@gmail.com,NA,<8d74d8a1-4a2f-4a43-2c47-022dc49f6585@gmail.com>,NA
Sent,12-04-2026 16:09:24,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkarhandore305@gmail.com,NA,<8d74d8a1-4a2f-4a43-2c47-022dc49f6585@gmail.com>,NA
Opened,12-04-2026 15:41:11,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Opened,12-04-2026 14:41:32,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Delivered,12-04-2026 14:03:57,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,pushkarnemade07@gmail.com,NA,<ef8b30e9-001d-9fcb-dd37-026d5395c8f8@gmail.com>,NA
Sent,12-04-2026 14:03:55,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,pushkarnemade07@gmail.com,NA,<ef8b30e9-001d-9fcb-dd37-026d5395c8f8@gmail.com>,NA
Opened,12-04-2026 13:41:15,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Opened,12-04-2026 13:40:41,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Opened,12-04-2026 13:33:35,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Opened,12-04-2026 13:32:45,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Clicked,12-04-2026 13:16:13,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Opened,12-04-2026 13:16:06,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Opened,12-04-2026 12:40:57,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Opened,12-04-2026 12:40:45,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
First opening,12-04-2026 12:40:19,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Delivered,12-04-2026 12:30:28,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkarsrathod0078@gmail.com,NA,<2f53b41b-74bc-aa5f-1544-425bfdb905c8@gmail.com>,NA
Sent,12-04-2026 12:30:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkarsrathod0078@gmail.com,NA,<2f53b41b-74bc-aa5f-1544-425bfdb905c8@gmail.com>,NA
Delivered,12-04-2026 12:27:07,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Sent,12-04-2026 12:27:05,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,samrat.gurav20@gmail.com,NA,<9106dd04-0df1-9464-9ac4-7b282a25b470@gmail.com>,NA
Clicked,12-04-2026 12:17:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryakukkadwal@gmail.com,NA,<2b185259-a877-3c42-63c1-50444989c296@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Clicked,12-04-2026 12:17:39,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryakukkadwal@gmail.com,NA,<2b185259-a877-3c42-63c1-50444989c296@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,12-04-2026 12:17:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryakukkadwal@gmail.com,NA,<2b185259-a877-3c42-63c1-50444989c296@gmail.com>,NA
Delivered,12-04-2026 12:17:04,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryakukkadwal@gmail.com,NA,<2b185259-a877-3c42-63c1-50444989c296@gmail.com>,NA
Sent,12-04-2026 12:17:02,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryakukkadwal@gmail.com,NA,<2b185259-a877-3c42-63c1-50444989c296@gmail.com>,NA
First opening,12-04-2026 12:16:22,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,odhage3@gmail.com,NA,<4811c6d3-6615-e646-0d8c-5f0436f1e2f7@gmail.com>,NA
Delivered,12-04-2026 12:15:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,odhage3@gmail.com,NA,<4811c6d3-6615-e646-0d8c-5f0436f1e2f7@gmail.com>,NA
Sent,12-04-2026 12:15:24,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,odhage3@gmail.com,NA,<4811c6d3-6615-e646-0d8c-5f0436f1e2f7@gmail.com>,NA
First opening,12-04-2026 12:12:12,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sahilmane981@gmail.com,NA,<8a50e455-0b0e-e910-3d9b-2dd065620b38@gmail.com>,NA
Delivered,12-04-2026 12:11:52,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sahilmane981@gmail.com,NA,<8a50e455-0b0e-e910-3d9b-2dd065620b38@gmail.com>,NA
Sent,12-04-2026 12:11:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sahilmane981@gmail.com,NA,<8a50e455-0b0e-e910-3d9b-2dd065620b38@gmail.com>,NA
First opening,12-04-2026 11:09:33,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkaryeote68@gmail.com,NA,<474cbfe0-cd0a-3593-ed08-03b815187597@gmail.com>,NA
Delivered,12-04-2026 11:09:14,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkaryeote68@gmail.com,NA,<474cbfe0-cd0a-3593-ed08-03b815187597@gmail.com>,NA
Sent,12-04-2026 11:09:12,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,omkaryeote68@gmail.com,NA,<474cbfe0-cd0a-3593-ed08-03b815187597@gmail.com>,NA
Delivered,12-04-2026 11:00:24,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,bhumi.patil_comp25@pccoer.in,NA,<f16cb22d-f623-965d-e42d-8008fa507022@gmail.com>,NA
Sent,12-04-2026 11:00:20,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,bhumi.patil_comp25@pccoer.in,NA,<f16cb22d-f623-965d-e42d-8008fa507022@gmail.com>,NA
Opened,12-04-2026 10:53:41,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ashishkavale32@gmail.com,NA,<1a80fa00-1e2b-e365-d99f-69e1ceee267f@gmail.com>,NA
First opening,12-04-2026 10:48:56,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ashishkavale32@gmail.com,NA,<1a80fa00-1e2b-e365-d99f-69e1ceee267f@gmail.com>,NA
Delivered,12-04-2026 10:48:52,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ashishkavale32@gmail.com,NA,<1a80fa00-1e2b-e365-d99f-69e1ceee267f@gmail.com>,NA
Sent,12-04-2026 10:48:49,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ashishkavale32@gmail.com,NA,<1a80fa00-1e2b-e365-d99f-69e1ceee267f@gmail.com>,NA
Clicked,12-04-2026 00:19:47,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,avadhoot2425@gmail.com,NA,<da5f4ace-9445-0a1c-af1c-d07964a0e8b3@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Delivered,11-04-2026 23:59:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,avadhoot2425@gmail.com,NA,<da5f4ace-9445-0a1c-af1c-d07964a0e8b3@gmail.com>,NA
Sent,11-04-2026 23:59:21,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,avadhoot2425@gmail.com,NA,<da5f4ace-9445-0a1c-af1c-d07964a0e8b3@gmail.com>,NA
Delivered,11-04-2026 22:26:13,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryan.kadam_civil25@pccoer.in,NA,<fafe9e8b-a54c-7e59-2b7f-30d4ff605eb2@gmail.com>,NA
Sent,11-04-2026 22:26:10,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryan.kadam_civil25@pccoer.in,NA,<fafe9e8b-a54c-7e59-2b7f-30d4ff605eb2@gmail.com>,NA
Clicked,11-04-2026 21:13:07,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vinay.wankhede_comp25@pccoer.in,NA,<7ec27437-5769-4004-185b-a4c75485a695@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,11-04-2026 21:13:04,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vinay.wankhede_comp25@pccoer.in,NA,<7ec27437-5769-4004-185b-a4c75485a695@gmail.com>,NA
First opening,11-04-2026 21:06:33,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,diksheeta.mundhada_comp25@pccoer.in,NA,<76bd535d-25ec-6516-0898-9624f510bf09@gmail.com>,NA
Opened,11-04-2026 21:06:32,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,diksheeta.mundhada_comp25@pccoer.in,NA,<52edfed7-37e9-a259-fad9-152f9ba4c631@gmail.com>,NA
Delivered,11-04-2026 21:03:04,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vinay.wankhede_comp25@pccoer.in,NA,<7ec27437-5769-4004-185b-a4c75485a695@gmail.com>,NA
Sent,11-04-2026 21:03:02,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vinay.wankhede_comp25@pccoer.in,NA,<7ec27437-5769-4004-185b-a4c75485a695@gmail.com>,NA
Delivered,11-04-2026 21:02:47,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashmane7566@gmail.com,NA,<8c03eb71-8f2a-932a-f69d-e5215e2146cd@gmail.com>,NA
Sent,11-04-2026 21:02:45,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashmane7566@gmail.com,NA,<8c03eb71-8f2a-932a-f69d-e5215e2146cd@gmail.com>,NA
Delivered,11-04-2026 21:02:36,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,pratik.kotkar_bca25@pccoer.in,NA,<8acd9d24-c5f7-15bf-bbb8-87b693ccca19@gmail.com>,NA
Sent,11-04-2026 21:02:34,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,pratik.kotkar_bca25@pccoer.in,NA,<8acd9d24-c5f7-15bf-bbb8-87b693ccca19@gmail.com>,NA
Delivered,11-04-2026 21:02:01,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<07c09c31-3c21-1eaf-a84d-1933f0dbdd5f@gmail.com>,NA
Sent,11-04-2026 21:01:59,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<07c09c31-3c21-1eaf-a84d-1933f0dbdd5f@gmail.com>,NA
Delivered,11-04-2026 21:01:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,diksheeta.mundhada_comp25@pccoer.in,NA,<76bd535d-25ec-6516-0898-9624f510bf09@gmail.com>,NA
Sent,11-04-2026 21:01:36,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,diksheeta.mundhada_comp25@pccoer.in,NA,<76bd535d-25ec-6516-0898-9624f510bf09@gmail.com>,NA
Error,11-04-2026 20:57:36,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,parthjadhav1969@gmail.com,NA,<cb547949-70bb-4063-b52c-2423d71edd68@smtp-relay.sendinblue.com>,NA
Sent,11-04-2026 20:57:36,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,parthjadhav1969@gmail.com,NA,<cb547949-70bb-4063-b52c-2423d71edd68@smtp-relay.sendinblue.com>,NA
Clicked,11-04-2026 20:42:58,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryan.kadam_civil25@pccoer.in,NA,<742f8b98-043d-4a9a-91c3-cb152223d26a@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Opened,11-04-2026 20:42:51,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryan.kadam_civil25@pccoer.in,NA,<742f8b98-043d-4a9a-91c3-cb152223d26a@gmail.com>,NA
First opening,11-04-2026 20:25:04,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryan.kadam_civil25@pccoer.in,NA,<742f8b98-043d-4a9a-91c3-cb152223d26a@gmail.com>,NA
Delivered,11-04-2026 20:24:56,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryan.kadam_civil25@pccoer.in,NA,<742f8b98-043d-4a9a-91c3-cb152223d26a@gmail.com>,NA
Sent,11-04-2026 20:24:54,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aryan.kadam_civil25@pccoer.in,NA,<742f8b98-043d-4a9a-91c3-cb152223d26a@gmail.com>,NA
Delivered,11-04-2026 18:24:27,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,survearyanamol27@gmail.com,NA,<3952790e-9c2f-b0c0-ddee-e9fb039bde10@gmail.com>,NA
Sent,11-04-2026 18:24:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,survearyanamol27@gmail.com,NA,<3952790e-9c2f-b0c0-ddee-e9fb039bde10@gmail.com>,NA
First opening,11-04-2026 18:06:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1bb4aa5e-16d1-da27-9e25-cda66c2bfc45@gmail.com>,NA
Delivered,11-04-2026 18:06:28,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1bb4aa5e-16d1-da27-9e25-cda66c2bfc45@gmail.com>,NA
Sent,11-04-2026 18:06:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1bb4aa5e-16d1-da27-9e25-cda66c2bfc45@gmail.com>,NA
Opened,11-04-2026 17:04:35,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<55efad9e-37b0-3088-062c-aa3ad9d03df3@gmail.com>,NA
Delivered,11-04-2026 16:23:14,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,parthjadhav1969@gmail.com,NA,<0f229cce-9d70-3ae1-94d0-2a929222e351@gmail.com>,NA
Sent,11-04-2026 16:23:12,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,parthjadhav1969@gmail.com,NA,<0f229cce-9d70-3ae1-94d0-2a929222e351@gmail.com>,NA
Delivered,11-04-2026 14:44:52,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,survearyanamol27@gmail.com,NA,<1753758d-a83a-b0be-55ed-9933813f1afc@gmail.com>,NA
Sent,11-04-2026 14:44:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,survearyanamol27@gmail.com,NA,<1753758d-a83a-b0be-55ed-9933813f1afc@gmail.com>,NA
Opened,11-04-2026 13:48:46,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<84f4ee45-a836-2c25-9e18-16c65099b022@gmail.com>,NA
Opened,11-04-2026 12:48:13,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<84f4ee45-a836-2c25-9e18-16c65099b022@gmail.com>,NA
Opened,11-04-2026 12:47:44,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Opened,11-04-2026 12:47:44,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<d76fa412-4b70-148a-fdbf-fb2f504efbfb@gmail.com>,NA
Opened,11-04-2026 12:47:44,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<21c37bc2-d1f5-f8c2-a187-bdfd649e8f39@gmail.com>,NA
First opening,11-04-2026 12:47:44,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<84f4ee45-a836-2c25-9e18-16c65099b022@gmail.com>,NA
Delivered,11-04-2026 12:47:38,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<84f4ee45-a836-2c25-9e18-16c65099b022@gmail.com>,NA
Sent,11-04-2026 12:47:36,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<84f4ee45-a836-2c25-9e18-16c65099b022@gmail.com>,NA
Opened,11-04-2026 12:45:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<d76fa412-4b70-148a-fdbf-fb2f504efbfb@gmail.com>,NA
Opened,11-04-2026 12:45:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Opened,11-04-2026 12:45:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<21c37bc2-d1f5-f8c2-a187-bdfd649e8f39@gmail.com>,NA
Opened,11-04-2026 12:45:38,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1069d6d0-52fe-8f1d-4e4d-095aed1f1f5b@gmail.com>,NA
Opened,11-04-2026 12:45:37,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7eda6f97-2f6f-1367-cb2b-ce5cfb922cab@gmail.com>,NA
Opened,11-04-2026 12:44:18,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<21c37bc2-d1f5-f8c2-a187-bdfd649e8f39@gmail.com>,NA
Opened,11-04-2026 12:44:18,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Opened,11-04-2026 12:44:18,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<d76fa412-4b70-148a-fdbf-fb2f504efbfb@gmail.com>,NA
First opening,11-04-2026 12:44:17,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7eda6f97-2f6f-1367-cb2b-ce5cfb922cab@gmail.com>,NA
Opened,11-04-2026 12:44:17,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1069d6d0-52fe-8f1d-4e4d-095aed1f1f5b@gmail.com>,NA
Opened,11-04-2026 12:43:39,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Opened,11-04-2026 12:43:39,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<21c37bc2-d1f5-f8c2-a187-bdfd649e8f39@gmail.com>,NA
Opened,11-04-2026 12:43:39,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<d76fa412-4b70-148a-fdbf-fb2f504efbfb@gmail.com>,NA
Opened,11-04-2026 12:43:39,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1069d6d0-52fe-8f1d-4e4d-095aed1f1f5b@gmail.com>,NA
Delivered,11-04-2026 12:43:34,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7eda6f97-2f6f-1367-cb2b-ce5cfb922cab@gmail.com>,NA
Sent,11-04-2026 12:43:31,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7eda6f97-2f6f-1367-cb2b-ce5cfb922cab@gmail.com>,NA
Opened,11-04-2026 12:42:44,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<d76fa412-4b70-148a-fdbf-fb2f504efbfb@gmail.com>,NA
First opening,11-04-2026 12:42:44,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<21c37bc2-d1f5-f8c2-a187-bdfd649e8f39@gmail.com>,NA
Opened,11-04-2026 12:42:44,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Delivered,11-04-2026 12:42:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<21c37bc2-d1f5-f8c2-a187-bdfd649e8f39@gmail.com>,NA
Sent,11-04-2026 12:42:24,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<21c37bc2-d1f5-f8c2-a187-bdfd649e8f39@gmail.com>,NA
Opened,11-04-2026 12:23:01,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7483a74c-9c2f-ba18-b8dd-f78db6e43205@gmail.com>,NA
Opened,11-04-2026 12:23:01,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1069d6d0-52fe-8f1d-4e4d-095aed1f1f5b@gmail.com>,NA
Opened,11-04-2026 12:15:18,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<55efad9e-37b0-3088-062c-aa3ad9d03df3@gmail.com>,NA
Opened,11-04-2026 12:14:33,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<55efad9e-37b0-3088-062c-aa3ad9d03df3@gmail.com>,NA
Opened,11-04-2026 12:14:15,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<55efad9e-37b0-3088-062c-aa3ad9d03df3@gmail.com>,NA
First opening,11-04-2026 12:13:44,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<55efad9e-37b0-3088-062c-aa3ad9d03df3@gmail.com>,NA
First opening,11-04-2026 12:13:13,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1069d6d0-52fe-8f1d-4e4d-095aed1f1f5b@gmail.com>,NA
Delivered,11-04-2026 12:13:07,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1069d6d0-52fe-8f1d-4e4d-095aed1f1f5b@gmail.com>,NA
Delivered,11-04-2026 12:13:06,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<55efad9e-37b0-3088-062c-aa3ad9d03df3@gmail.com>,NA
Sent,11-04-2026 12:13:04,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1069d6d0-52fe-8f1d-4e4d-095aed1f1f5b@gmail.com>,NA
Sent,11-04-2026 12:13:04,🎓 Your Team Certificates,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<55efad9e-37b0-3088-062c-aa3ad9d03df3@gmail.com>,NA
First opening,11-04-2026 12:11:43,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<5a0ccc39-744b-04c9-c9c7-956316777eff@gmail.com>,NA
Delivered,11-04-2026 12:11:24,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<5a0ccc39-744b-04c9-c9c7-956316777eff@gmail.com>,NA
Sent,11-04-2026 12:11:21,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<5a0ccc39-744b-04c9-c9c7-956316777eff@gmail.com>,NA
Opened,11-04-2026 12:10:40,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<a295178a-8632-931c-f0ca-d3856325b094@gmail.com>,NA
Opened,11-04-2026 12:10:40,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3dc5534c-1b59-683a-a93f-3dbe0fc615cb@gmail.com>,NA
Opened,11-04-2026 12:10:40,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<988f38db-a785-bc36-7c39-30826b19a3a8@gmail.com>,NA
Opened,11-04-2026 12:10:40,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<aaed1cf7-4aaa-2fc4-9cdd-93150f82d86b@gmail.com>,NA
Opened,11-04-2026 12:06:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Opened,11-04-2026 12:06:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<d76fa412-4b70-148a-fdbf-fb2f504efbfb@gmail.com>,NA
Opened,11-04-2026 12:06:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<cca0089f-ee99-98cd-4606-7add0bd01544@gmail.com>,NA
First opening,11-04-2026 12:06:38,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7483a74c-9c2f-ba18-b8dd-f78db6e43205@gmail.com>,NA
Delivered,11-04-2026 12:06:33,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7483a74c-9c2f-ba18-b8dd-f78db6e43205@gmail.com>,NA
Sent,11-04-2026 12:06:31,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7483a74c-9c2f-ba18-b8dd-f78db6e43205@gmail.com>,NA
Opened,11-04-2026 12:05:51,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<988f38db-a785-bc36-7c39-30826b19a3a8@gmail.com>,NA
Opened,11-04-2026 12:05:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3dc5534c-1b59-683a-a93f-3dbe0fc615cb@gmail.com>,NA
Opened,11-04-2026 12:05:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<a295178a-8632-931c-f0ca-d3856325b094@gmail.com>,NA
Opened,11-04-2026 12:05:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<aaed1cf7-4aaa-2fc4-9cdd-93150f82d86b@gmail.com>,NA
Opened,11-04-2026 12:05:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<cca0089f-ee99-98cd-4606-7add0bd01544@gmail.com>,NA
Opened,11-04-2026 12:05:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<483a9e5e-0215-b3ae-a1ca-df82c78b43b1@gmail.com>,NA
Opened,11-04-2026 12:05:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
First opening,11-04-2026 12:05:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<d76fa412-4b70-148a-fdbf-fb2f504efbfb@gmail.com>,NA
Delivered,11-04-2026 12:05:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<d76fa412-4b70-148a-fdbf-fb2f504efbfb@gmail.com>,NA
Sent,11-04-2026 12:05:35,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<d76fa412-4b70-148a-fdbf-fb2f504efbfb@gmail.com>,NA
Opened,11-04-2026 11:46:59,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<cca0089f-ee99-98cd-4606-7add0bd01544@gmail.com>,NA
Hard bounce,11-04-2026 11:40:16,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,abc@gmail.com,NA,<a896195e-1b57-d4d3-8faa-d396e7e6a62e@gmail.com>,NA
Sent,11-04-2026 11:40:15,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,abc@gmail.com,NA,<a896195e-1b57-d4d3-8faa-d396e7e6a62e@gmail.com>,NA
Opened,11-04-2026 11:33:29,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<cca0089f-ee99-98cd-4606-7add0bd01544@gmail.com>,NA
Clicked,11-04-2026 10:53:14,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,diksheeta.mundhada_comp25@pccoer.in,NA,<52edfed7-37e9-a259-fad9-152f9ba4c631@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,11-04-2026 10:53:08,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,diksheeta.mundhada_comp25@pccoer.in,NA,<52edfed7-37e9-a259-fad9-152f9ba4c631@gmail.com>,NA
Delivered,11-04-2026 10:52:01,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,diksheeta.mundhada_comp25@pccoer.in,NA,<52edfed7-37e9-a259-fad9-152f9ba4c631@gmail.com>,NA
Sent,11-04-2026 10:51:59,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,diksheeta.mundhada_comp25@pccoer.in,NA,<52edfed7-37e9-a259-fad9-152f9ba4c631@gmail.com>,NA
Opened,11-04-2026 10:45:45,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<988f38db-a785-bc36-7c39-30826b19a3a8@gmail.com>,NA
Opened,11-04-2026 10:15:57,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<f00c49fe-48df-7e66-e9b6-b06a3c8bdc3f@gmail.com>,NA
Opened,11-04-2026 10:14:05,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<f00c49fe-48df-7e66-e9b6-b06a3c8bdc3f@gmail.com>,NA
Clicked,11-04-2026 03:37:16,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<cca0089f-ee99-98cd-4606-7add0bd01544@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Opened,11-04-2026 03:36:24,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
First opening,11-04-2026 03:36:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<cca0089f-ee99-98cd-4606-7add0bd01544@gmail.com>,NA
Delivered,11-04-2026 03:36:17,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<cca0089f-ee99-98cd-4606-7add0bd01544@gmail.com>,NA
Sent,11-04-2026 03:36:15,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<cca0089f-ee99-98cd-4606-7add0bd01544@gmail.com>,NA
First opening,11-04-2026 03:35:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<483a9e5e-0215-b3ae-a1ca-df82c78b43b1@gmail.com>,NA
Opened,11-04-2026 03:35:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<ec4f66c1-2a87-1803-590c-e33048b7fce9@gmail.com>,NA
Opened,11-04-2026 03:35:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<f4245ae7-b0cc-08f2-0694-a5b701124a57@gmail.com>,NA
Opened,11-04-2026 03:35:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Delivered,11-04-2026 03:35:17,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<483a9e5e-0215-b3ae-a1ca-df82c78b43b1@gmail.com>,NA
Sent,11-04-2026 03:35:15,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<483a9e5e-0215-b3ae-a1ca-df82c78b43b1@gmail.com>,NA
Opened,11-04-2026 03:34:04,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<ec4f66c1-2a87-1803-590c-e33048b7fce9@gmail.com>,NA
Opened,11-04-2026 03:34:04,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7072d20b-e10a-59d8-2e4c-67e226c5ad74@gmail.com>,NA
Opened,11-04-2026 03:34:04,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
First opening,11-04-2026 03:34:04,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<f4245ae7-b0cc-08f2-0694-a5b701124a57@gmail.com>,NA
Delivered,11-04-2026 03:33:55,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<f4245ae7-b0cc-08f2-0694-a5b701124a57@gmail.com>,NA
Sent,11-04-2026 03:33:53,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<f4245ae7-b0cc-08f2-0694-a5b701124a57@gmail.com>,NA
Opened,11-04-2026 03:28:01,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Opened,11-04-2026 03:28:01,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<ec4f66c1-2a87-1803-590c-e33048b7fce9@gmail.com>,NA
Opened,11-04-2026 03:28:00,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7072d20b-e10a-59d8-2e4c-67e226c5ad74@gmail.com>,NA
First opening,11-04-2026 03:27:36,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<ec4f66c1-2a87-1803-590c-e33048b7fce9@gmail.com>,NA
Delivered,11-04-2026 03:27:07,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<ec4f66c1-2a87-1803-590c-e33048b7fce9@gmail.com>,NA
Sent,11-04-2026 03:27:04,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<ec4f66c1-2a87-1803-590c-e33048b7fce9@gmail.com>,NA
Sent,11-04-2026 03:11:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,pratik.kotkar_bca25@pccoer.in,NA,<f9b3ccbe-1425-4ae5-bd9d-e2efaf861cd2@smtp-relay.sendinblue.com>,NA
Error,11-04-2026 03:11:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,pratik.kotkar_bca25@pccoer.in,NA,<f9b3ccbe-1425-4ae5-bd9d-e2efaf861cd2@smtp-relay.sendinblue.com>,NA
Opened,11-04-2026 00:34:22,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sarphalesiddhesh@gmail.com,NA,<6f7832ba-2754-afe7-b27e-6205b70269c6@gmail.com>,NA
First opening,11-04-2026 00:34:22,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,sarphalesiddhesh@gmail.com,NA,<c3b280d0-58d4-a074-b567-727c76dd238e@gmail.com>,NA
Delivered,11-04-2026 00:34:00,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,sarphalesiddhesh@gmail.com,NA,<c3b280d0-58d4-a074-b567-727c76dd238e@gmail.com>,NA
Sent,11-04-2026 00:33:58,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,sarphalesiddhesh@gmail.com,NA,<c3b280d0-58d4-a074-b567-727c76dd238e@gmail.com>,NA
Opened,11-04-2026 00:32:46,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sarphalesiddhesh@gmail.com,NA,<6f7832ba-2754-afe7-b27e-6205b70269c6@gmail.com>,NA
First opening,11-04-2026 00:28:54,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sarphalesiddhesh@gmail.com,NA,<6f7832ba-2754-afe7-b27e-6205b70269c6@gmail.com>,NA
Delivered,11-04-2026 00:28:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sarphalesiddhesh@gmail.com,NA,<6f7832ba-2754-afe7-b27e-6205b70269c6@gmail.com>,NA
Sent,11-04-2026 00:28:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sarphalesiddhesh@gmail.com,NA,<6f7832ba-2754-afe7-b27e-6205b70269c6@gmail.com>,NA
Opened,11-04-2026 00:24:48,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<988f38db-a785-bc36-7c39-30826b19a3a8@gmail.com>,NA
Opened,10-04-2026 23:52:03,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<2c9759e6-9560-8d4c-d067-7725742a5de7@gmail.com>,NA
Opened,10-04-2026 23:52:03,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<ef50dc25-3293-0490-7ad4-a912bd316fef@gmail.com>,NA
First opening,10-04-2026 23:51:28,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<ef50dc25-3293-0490-7ad4-a912bd316fef@gmail.com>,NA
First opening,10-04-2026 23:51:28,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<2c9759e6-9560-8d4c-d067-7725742a5de7@gmail.com>,NA
Delivered,10-04-2026 23:43:56,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<ef50dc25-3293-0490-7ad4-a912bd316fef@gmail.com>,NA
Sent,10-04-2026 23:43:53,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<ef50dc25-3293-0490-7ad4-a912bd316fef@gmail.com>,NA
Delivered,10-04-2026 23:25:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<2c9759e6-9560-8d4c-d067-7725742a5de7@gmail.com>,NA
Sent,10-04-2026 23:25:40,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,sukrut23@gmail.com,NA,<2c9759e6-9560-8d4c-d067-7725742a5de7@gmail.com>,NA
First opening,10-04-2026 23:25:07,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vinay.wankhede_comp25@pccoer.in,NA,<cd98a6dd-73c6-e2cc-1b70-2ff904c17ba5@gmail.com>,NA
Delivered,10-04-2026 23:24:47,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vinay.wankhede_comp25@pccoer.in,NA,<cd98a6dd-73c6-e2cc-1b70-2ff904c17ba5@gmail.com>,NA
Sent,10-04-2026 23:24:45,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,vinay.wankhede_comp25@pccoer.in,NA,<cd98a6dd-73c6-e2cc-1b70-2ff904c17ba5@gmail.com>,NA
First opening,10-04-2026 22:57:23,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<988f38db-a785-bc36-7c39-30826b19a3a8@gmail.com>,NA
Delivered,10-04-2026 22:57:14,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<988f38db-a785-bc36-7c39-30826b19a3a8@gmail.com>,NA
Sent,10-04-2026 22:57:12,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<988f38db-a785-bc36-7c39-30826b19a3a8@gmail.com>,NA
First opening,10-04-2026 22:52:21,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<a295178a-8632-931c-f0ca-d3856325b094@gmail.com>,NA
First opening,10-04-2026 22:52:21,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<aaed1cf7-4aaa-2fc4-9cdd-93150f82d86b@gmail.com>,NA
Delivered,10-04-2026 22:52:01,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<a295178a-8632-931c-f0ca-d3856325b094@gmail.com>,NA
Sent,10-04-2026 22:51:59,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<a295178a-8632-931c-f0ca-d3856325b094@gmail.com>,NA
Opened,10-04-2026 22:06:55,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<fe8f0b0e-08f6-352d-c630-3b4435ebad8d@gmail.com>,NA
First opening,10-04-2026 22:06:55,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<0a12e3da-36d0-d624-47c5-bd3b96b1b1a7@gmail.com>,NA
Delivered,10-04-2026 22:05:44,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<aaed1cf7-4aaa-2fc4-9cdd-93150f82d86b@gmail.com>,NA
Sent,10-04-2026 22:05:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<aaed1cf7-4aaa-2fc4-9cdd-93150f82d86b@gmail.com>,NA
Delivered,10-04-2026 22:05:12,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<0a12e3da-36d0-d624-47c5-bd3b96b1b1a7@gmail.com>,NA
Sent,10-04-2026 22:05:09,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<0a12e3da-36d0-d624-47c5-bd3b96b1b1a7@gmail.com>,NA
Delivered,10-04-2026 21:54:10,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,pratik.kotkar_bca25@pccoer.in,NA,<5e0415a1-1e31-d7d9-0203-bac83aa41c59@gmail.com>,NA
Sent,10-04-2026 21:54:07,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,pratik.kotkar_bca25@pccoer.in,NA,<5e0415a1-1e31-d7d9-0203-bac83aa41c59@gmail.com>,NA
Delivered,10-04-2026 21:53:29,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashmane7566@gmail.com,NA,<6fa97f16-c5de-dd99-4ef7-455b115eaf11@gmail.com>,NA
Sent,10-04-2026 21:53:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashmane7566@gmail.com,NA,<6fa97f16-c5de-dd99-4ef7-455b115eaf11@gmail.com>,NA
First opening,10-04-2026 21:28:58,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7072d20b-e10a-59d8-2e4c-67e226c5ad74@gmail.com>,NA
Delivered,10-04-2026 21:28:53,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7072d20b-e10a-59d8-2e4c-67e226c5ad74@gmail.com>,NA
Sent,10-04-2026 21:28:51,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7072d20b-e10a-59d8-2e4c-67e226c5ad74@gmail.com>,NA
Opened,10-04-2026 21:27:34,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7e93a83a-36a7-8e58-5b9b-797a26a76cec@gmail.com>,NA
Opened,10-04-2026 21:27:30,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
First opening,10-04-2026 21:27:19,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1419da99-3319-dc05-96b9-89d05d783164@gmail.com>,NA
First opening,10-04-2026 21:27:07,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<f7b3d246-0165-a12a-2ef7-82066a8f4270@gmail.com>,NA
Delivered,10-04-2026 21:26:59,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<f7b3d246-0165-a12a-2ef7-82066a8f4270@gmail.com>,NA
Sent,10-04-2026 21:26:56,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<f7b3d246-0165-a12a-2ef7-82066a8f4270@gmail.com>,NA
Opened,10-04-2026 21:17:41,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Opened,10-04-2026 21:17:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7e93a83a-36a7-8e58-5b9b-797a26a76cec@gmail.com>,NA
Opened,10-04-2026 21:17:19,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Opened,10-04-2026 21:17:19,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7e93a83a-36a7-8e58-5b9b-797a26a76cec@gmail.com>,NA
Delivered,10-04-2026 21:17:14,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1419da99-3319-dc05-96b9-89d05d783164@gmail.com>,NA
Sent,10-04-2026 21:17:12,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1419da99-3319-dc05-96b9-89d05d783164@gmail.com>,NA
Opened,10-04-2026 21:11:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
First opening,10-04-2026 21:11:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7e93a83a-36a7-8e58-5b9b-797a26a76cec@gmail.com>,NA
Delivered,10-04-2026 21:11:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7e93a83a-36a7-8e58-5b9b-797a26a76cec@gmail.com>,NA
Sent,10-04-2026 21:11:35,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7e93a83a-36a7-8e58-5b9b-797a26a76cec@gmail.com>,NA
Opened,10-04-2026 21:05:12,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Opened,10-04-2026 20:53:09,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
First opening,10-04-2026 20:52:59,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Delivered,10-04-2026 20:52:40,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Sent,10-04-2026 20:52:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6598fd89-4def-a531-8fca-cd65b41319cc@gmail.com>,NA
Opened,10-04-2026 20:46:09,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Opened,10-04-2026 20:46:09,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Opened,10-04-2026 20:14:49,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashmane7566@gmail.com,NA,<fa479927-67a4-b2ce-cf8f-6cb45af26cd1@gmail.com>,NA
First opening,10-04-2026 20:14:49,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashmane7566@gmail.com,NA,<0be92ad4-b7b3-bead-291e-94e32b8890bd@gmail.com>,NA
Delivered,10-04-2026 20:04:55,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashmane7566@gmail.com,NA,<0be92ad4-b7b3-bead-291e-94e32b8890bd@gmail.com>,NA
Sent,10-04-2026 20:04:53,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashmane7566@gmail.com,NA,<0be92ad4-b7b3-bead-291e-94e32b8890bd@gmail.com>,NA
First opening,10-04-2026 19:11:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashmane7566@gmail.com,NA,<fa479927-67a4-b2ce-cf8f-6cb45af26cd1@gmail.com>,NA
Delivered,10-04-2026 15:46:18,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashmane7566@gmail.com,NA,<fa479927-67a4-b2ce-cf8f-6cb45af26cd1@gmail.com>,NA
Sent,10-04-2026 15:46:16,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,yashmane7566@gmail.com,NA,<fa479927-67a4-b2ce-cf8f-6cb45af26cd1@gmail.com>,NA
First opening,10-04-2026 15:40:24,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,pratik.kotkar_bca25@pccoer.in,NA,<ab6a0eaa-edf8-9edc-71a2-053b3bb3eca7@gmail.com>,NA
Delivered,10-04-2026 15:39:46,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,pratik.kotkar_bca25@pccoer.in,NA,<ab6a0eaa-edf8-9edc-71a2-053b3bb3eca7@gmail.com>,NA
Sent,10-04-2026 15:39:41,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,pratik.kotkar_bca25@pccoer.in,NA,<ab6a0eaa-edf8-9edc-71a2-053b3bb3eca7@gmail.com>,NA
First opening,10-04-2026 12:37:40,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<f00c49fe-48df-7e66-e9b6-b06a3c8bdc3f@gmail.com>,NA
Delivered,10-04-2026 12:37:15,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<f00c49fe-48df-7e66-e9b6-b06a3c8bdc3f@gmail.com>,NA
Sent,10-04-2026 12:37:13,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<f00c49fe-48df-7e66-e9b6-b06a3c8bdc3f@gmail.com>,NA
First opening,10-04-2026 12:35:30,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<fe8f0b0e-08f6-352d-c630-3b4435ebad8d@gmail.com>,NA
Delivered,10-04-2026 12:34:55,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<fe8f0b0e-08f6-352d-c630-3b4435ebad8d@gmail.com>,NA
Sent,10-04-2026 12:34:53,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,eshapansare05@gmail.com,NA,<fe8f0b0e-08f6-352d-c630-3b4435ebad8d@gmail.com>,NA
First opening,10-04-2026 12:28:54,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3dc5534c-1b59-683a-a93f-3dbe0fc615cb@gmail.com>,NA
Delivered,10-04-2026 12:27:39,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3dc5534c-1b59-683a-a93f-3dbe0fc615cb@gmail.com>,NA
Sent,10-04-2026 12:27:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3dc5534c-1b59-683a-a93f-3dbe0fc615cb@gmail.com>,NA
Opened,10-04-2026 12:22:14,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<305f64d7-7cd5-8ff6-bc0d-aabacafc66a0@gmail.com>,NA
Opened,10-04-2026 12:22:14,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<8b2e3a67-1b45-e2f4-1464-cbcc8af14f48@gmail.com>,NA
Opened,10-04-2026 12:22:14,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<40047413-9578-b7ad-7aa0-a362504c0d00@gmail.com>,NA
Opened,10-04-2026 12:22:13,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3b39d699-f038-9dab-c957-c1df0118f9e7@gmail.com>,NA
Opened,10-04-2026 12:22:13,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<0d14cf30-0993-7fd6-0221-2034d107e249@gmail.com>,NA
Opened,10-04-2026 12:17:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3b39d699-f038-9dab-c957-c1df0118f9e7@gmail.com>,NA
Opened,10-04-2026 12:17:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<0d14cf30-0993-7fd6-0221-2034d107e249@gmail.com>,NA
Opened,10-04-2026 12:17:42,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<40047413-9578-b7ad-7aa0-a362504c0d00@gmail.com>,NA
Opened,10-04-2026 12:17:42,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<8b2e3a67-1b45-e2f4-1464-cbcc8af14f48@gmail.com>,NA
Opened,10-04-2026 12:17:42,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<305f64d7-7cd5-8ff6-bc0d-aabacafc66a0@gmail.com>,NA
Opened,10-04-2026 11:45:30,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Opened,10-04-2026 10:33:29,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kushalborse08@gmail.com,NA,<bdd71dab-7682-075b-e927-5502c7eea9bd@gmail.com>,NA
Opened,09-04-2026 23:27:57,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<b0637d37-af07-d010-aa65-96ebe9c6526d@gmail.com>,NA
Opened,09-04-2026 23:27:56,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Opened,09-04-2026 23:27:56,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7248cd07-b25a-e83e-179a-2cbb7181cf89@gmail.com>,NA
Opened,09-04-2026 23:27:56,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<320fcd32-1892-62b5-7bdc-faca37769624@gmail.com>,NA
Opened,09-04-2026 23:27:05,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Opened,09-04-2026 23:27:05,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Opened,09-04-2026 23:25:59,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Opened,09-04-2026 23:25:59,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Opened,09-04-2026 15:59:01,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<320fcd32-1892-62b5-7bdc-faca37769624@gmail.com>,NA
Opened,09-04-2026 15:59:01,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7248cd07-b25a-e83e-179a-2cbb7181cf89@gmail.com>,NA
Opened,09-04-2026 15:59:01,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<b0637d37-af07-d010-aa65-96ebe9c6526d@gmail.com>,NA
Opened,09-04-2026 15:59:01,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Opened,09-04-2026 15:46:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Opened,09-04-2026 15:46:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Opened,09-04-2026 14:06:22,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Opened,09-04-2026 14:06:22,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Opened,09-04-2026 14:04:24,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Opened,09-04-2026 13:11:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<0d14cf30-0993-7fd6-0221-2034d107e249@gmail.com>,NA
Opened,09-04-2026 13:11:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3b39d699-f038-9dab-c957-c1df0118f9e7@gmail.com>,NA
Opened,09-04-2026 13:11:24,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<305f64d7-7cd5-8ff6-bc0d-aabacafc66a0@gmail.com>,NA
First opening,09-04-2026 13:11:24,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<40047413-9578-b7ad-7aa0-a362504c0d00@gmail.com>,NA
Opened,09-04-2026 13:11:24,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<8b2e3a67-1b45-e2f4-1464-cbcc8af14f48@gmail.com>,NA
Delivered,09-04-2026 13:11:19,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<40047413-9578-b7ad-7aa0-a362504c0d00@gmail.com>,NA
Sent,09-04-2026 13:11:18,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<40047413-9578-b7ad-7aa0-a362504c0d00@gmail.com>,NA
Opened,09-04-2026 13:08:27,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3b39d699-f038-9dab-c957-c1df0118f9e7@gmail.com>,NA
Opened,09-04-2026 13:08:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<0d14cf30-0993-7fd6-0221-2034d107e249@gmail.com>,NA
First opening,09-04-2026 13:07:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<0d14cf30-0993-7fd6-0221-2034d107e249@gmail.com>,NA
Opened,09-04-2026 13:07:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3b39d699-f038-9dab-c957-c1df0118f9e7@gmail.com>,NA
Delivered,09-04-2026 13:07:33,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<0d14cf30-0993-7fd6-0221-2034d107e249@gmail.com>,NA
Sent,09-04-2026 13:07:31,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<0d14cf30-0993-7fd6-0221-2034d107e249@gmail.com>,NA
Opened,09-04-2026 12:27:03,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7248cd07-b25a-e83e-179a-2cbb7181cf89@gmail.com>,NA
Opened,09-04-2026 12:27:03,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<b0637d37-af07-d010-aa65-96ebe9c6526d@gmail.com>,NA
Opened,09-04-2026 12:27:03,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Opened,09-04-2026 12:27:03,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<320fcd32-1892-62b5-7bdc-faca37769624@gmail.com>,NA
First opening,09-04-2026 12:08:58,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<8b2e3a67-1b45-e2f4-1464-cbcc8af14f48@gmail.com>,NA
Opened,09-04-2026 12:08:51,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3b39d699-f038-9dab-c957-c1df0118f9e7@gmail.com>,NA
Opened,09-04-2026 12:08:51,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<305f64d7-7cd5-8ff6-bc0d-aabacafc66a0@gmail.com>,NA
Delivered,09-04-2026 12:08:46,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<8b2e3a67-1b45-e2f4-1464-cbcc8af14f48@gmail.com>,NA
Sent,09-04-2026 12:08:45,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<8b2e3a67-1b45-e2f4-1464-cbcc8af14f48@gmail.com>,NA
Opened,09-04-2026 12:07:36,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7248cd07-b25a-e83e-179a-2cbb7181cf89@gmail.com>,NA
First opening,09-04-2026 12:07:36,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<b0637d37-af07-d010-aa65-96ebe9c6526d@gmail.com>,NA
Opened,09-04-2026 12:07:36,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<320fcd32-1892-62b5-7bdc-faca37769624@gmail.com>,NA
Opened,09-04-2026 12:07:36,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Delivered,09-04-2026 12:07:30,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<b0637d37-af07-d010-aa65-96ebe9c6526d@gmail.com>,NA
Sent,09-04-2026 12:07:29,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<b0637d37-af07-d010-aa65-96ebe9c6526d@gmail.com>,NA
Opened,09-04-2026 12:07:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3b39d699-f038-9dab-c957-c1df0118f9e7@gmail.com>,NA
First opening,09-04-2026 12:07:23,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<305f64d7-7cd5-8ff6-bc0d-aabacafc66a0@gmail.com>,NA
First opening,09-04-2026 12:03:51,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7248cd07-b25a-e83e-179a-2cbb7181cf89@gmail.com>,NA
Opened,09-04-2026 12:03:51,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<320fcd32-1892-62b5-7bdc-faca37769624@gmail.com>,NA
Opened,09-04-2026 12:03:51,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Delivered,09-04-2026 12:03:45,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7248cd07-b25a-e83e-179a-2cbb7181cf89@gmail.com>,NA
Sent,09-04-2026 12:03:44,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<7248cd07-b25a-e83e-179a-2cbb7181cf89@gmail.com>,NA
Opened,09-04-2026 12:03:18,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Delivered,09-04-2026 12:00:17,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,kushalborse08@gmail.com,NA,<a02106cd-4258-1aba-e24e-5c0bfbbe4473@gmail.com>,NA
Sent,09-04-2026 12:00:16,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,kushalborse08@gmail.com,NA,<a02106cd-4258-1aba-e24e-5c0bfbbe4473@gmail.com>,NA
Delivered,09-04-2026 11:58:10,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<305f64d7-7cd5-8ff6-bc0d-aabacafc66a0@gmail.com>,NA
Sent,09-04-2026 11:58:08,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<305f64d7-7cd5-8ff6-bc0d-aabacafc66a0@gmail.com>,NA
Opened,09-04-2026 11:47:35,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kushalborse08@gmail.com,NA,<bdd71dab-7682-075b-e927-5502c7eea9bd@gmail.com>,NA
First opening,09-04-2026 11:30:29,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3b39d699-f038-9dab-c957-c1df0118f9e7@gmail.com>,NA
Delivered,09-04-2026 11:30:11,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3b39d699-f038-9dab-c957-c1df0118f9e7@gmail.com>,NA
Sent,09-04-2026 11:30:08,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,akash.apatil05@gmail.com,NA,<3b39d699-f038-9dab-c957-c1df0118f9e7@gmail.com>,NA
Opened,09-04-2026 11:07:26,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<320fcd32-1892-62b5-7bdc-faca37769624@gmail.com>,NA
First opening,09-04-2026 10:15:29,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kushalborse08@gmail.com,NA,<bdd71dab-7682-075b-e927-5502c7eea9bd@gmail.com>,NA
Delivered,09-04-2026 10:14:41,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kushalborse08@gmail.com,NA,<bdd71dab-7682-075b-e927-5502c7eea9bd@gmail.com>,NA
Sent,09-04-2026 10:14:39,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,kushalborse08@gmail.com,NA,<bdd71dab-7682-075b-e927-5502c7eea9bd@gmail.com>,NA
Opened,09-04-2026 03:02:06,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<320fcd32-1892-62b5-7bdc-faca37769624@gmail.com>,NA
First opening,09-04-2026 03:00:40,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<320fcd32-1892-62b5-7bdc-faca37769624@gmail.com>,NA
Delivered,09-04-2026 03:00:33,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<320fcd32-1892-62b5-7bdc-faca37769624@gmail.com>,NA
Sent,09-04-2026 03:00:32,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<320fcd32-1892-62b5-7bdc-faca37769624@gmail.com>,NA
Opened,09-04-2026 03:00:01,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Opened,09-04-2026 03:00:00,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
First opening,09-04-2026 02:57:41,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Delivered,09-04-2026 02:57:31,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Sent,09-04-2026 02:57:29,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<2771be2c-9d94-60a8-2e60-87c8ea03899e@gmail.com>,NA
Opened,09-04-2026 02:46:03,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<9dcc881e-7692-90a5-0947-64ed0b7eb810@gmail.com>,NA
Opened,09-04-2026 02:46:03,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Opened,09-04-2026 02:46:02,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Opened,09-04-2026 02:43:11,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<efd075e3-d398-bf89-5bc6-36888d7d0539@gmail.com>,NA
Opened,09-04-2026 02:43:05,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<27605415-3835-727a-bfc5-7658ea42cd9b@gmail.com>,NA
Opened,09-04-2026 02:43:05,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<722c2ac4-dcab-b237-beaf-9c62dd1becfc@gmail.com>,NA
Opened,09-04-2026 02:43:05,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<c55d3ab9-f489-c9c3-5935-b2c408ba9b33@gmail.com>,NA
Opened,09-04-2026 02:31:27,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Opened,09-04-2026 02:31:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Opened,09-04-2026 02:31:26,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<9dcc881e-7692-90a5-0947-64ed0b7eb810@gmail.com>,NA
Opened,09-04-2026 01:46:28,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Opened,09-04-2026 01:46:27,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Opened,09-04-2026 01:46:27,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<9dcc881e-7692-90a5-0947-64ed0b7eb810@gmail.com>,NA
Opened,09-04-2026 01:46:16,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Opened,09-04-2026 01:46:14,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<9dcc881e-7692-90a5-0947-64ed0b7eb810@gmail.com>,NA
Opened,09-04-2026 01:46:14,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<5c2dd7a3-d8c4-d7da-69d7-0c2c8b13fc8c@gmail.com>,NA
First opening,09-04-2026 01:41:02,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Delivered,09-04-2026 01:40:44,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Sent,09-04-2026 01:40:42,🎓 Your Certificate,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<fae28a36-9689-1a7a-59c0-5f69bbe20efb@gmail.com>,NA
Opened,09-04-2026 01:23:33,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Opened,09-04-2026 01:21:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<4e601c23-68e0-1a45-ff00-a0310488122d@gmail.com>,NA
First opening,09-04-2026 01:15:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Delivered,09-04-2026 01:15:37,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
Sent,09-04-2026 01:15:34,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<1c2e6a35-2965-bd0f-820c-4e4e216ffba2@gmail.com>,NA
First opening,09-04-2026 01:14:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<9dcc881e-7692-90a5-0947-64ed0b7eb810@gmail.com>,NA
Delivered,09-04-2026 01:14:20,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<9dcc881e-7692-90a5-0947-64ed0b7eb810@gmail.com>,NA
Sent,09-04-2026 01:14:18,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<9dcc881e-7692-90a5-0947-64ed0b7eb810@gmail.com>,NA
Opened,09-04-2026 01:13:14,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<5c2dd7a3-d8c4-d7da-69d7-0c2c8b13fc8c@gmail.com>,NA
First opening,09-04-2026 01:11:06,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<5c2dd7a3-d8c4-d7da-69d7-0c2c8b13fc8c@gmail.com>,NA
Delivered,09-04-2026 01:11:01,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<5c2dd7a3-d8c4-d7da-69d7-0c2c8b13fc8c@gmail.com>,NA
Sent,09-04-2026 01:10:58,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<5c2dd7a3-d8c4-d7da-69d7-0c2c8b13fc8c@gmail.com>,NA
First opening,09-04-2026 01:08:34,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<3af17eb1-bccc-b37e-3f61-3bfbbf2156bd@gmail.com>,NA
Opened,09-04-2026 01:08:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<224f71c1-a6d9-4643-7f76-04c900bebcc4@gmail.com>,NA
Delivered,09-04-2026 01:08:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<3af17eb1-bccc-b37e-3f61-3bfbbf2156bd@gmail.com>,NA
Sent,09-04-2026 01:08:21,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<3af17eb1-bccc-b37e-3f61-3bfbbf2156bd@gmail.com>,NA
First opening,09-04-2026 01:07:45,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<224f71c1-a6d9-4643-7f76-04c900bebcc4@gmail.com>,NA
Delivered,09-04-2026 01:07:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<224f71c1-a6d9-4643-7f76-04c900bebcc4@gmail.com>,NA
Sent,09-04-2026 01:07:35,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<224f71c1-a6d9-4643-7f76-04c900bebcc4@gmail.com>,NA
First opening,09-04-2026 01:05:30,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<8855e4a1-6d65-d7f6-6b2d-b13ad2ccde8b@gmail.com>,NA
Delivered,09-04-2026 01:05:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<8855e4a1-6d65-d7f6-6b2d-b13ad2ccde8b@gmail.com>,NA
Sent,09-04-2026 01:05:23,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<8855e4a1-6d65-d7f6-6b2d-b13ad2ccde8b@gmail.com>,NA
First opening,09-04-2026 01:04:03,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<4e601c23-68e0-1a45-ff00-a0310488122d@gmail.com>,NA
First opening,09-04-2026 01:04:03,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<9707b3e1-636f-7db3-d2f7-321ce0ad8a91@gmail.com>,NA
Delivered,09-04-2026 01:03:57,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<9707b3e1-636f-7db3-d2f7-321ce0ad8a91@gmail.com>,NA
Sent,09-04-2026 01:03:54,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<9707b3e1-636f-7db3-d2f7-321ce0ad8a91@gmail.com>,NA
First opening,09-04-2026 00:57:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<61c3eba0-a11f-e9ce-b2c7-f021007936e7@gmail.com>,NA
Delivered,09-04-2026 00:55:34,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<61c3eba0-a11f-e9ce-b2c7-f021007936e7@gmail.com>,NA
Sent,09-04-2026 00:55:31,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<61c3eba0-a11f-e9ce-b2c7-f021007936e7@gmail.com>,NA
Delivered,09-04-2026 00:53:17,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<4e601c23-68e0-1a45-ff00-a0310488122d@gmail.com>,NA
Sent,09-04-2026 00:53:15,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<4e601c23-68e0-1a45-ff00-a0310488122d@gmail.com>,NA
`;

const processCSV = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Backfill");

    const rows = csvData.trim().split("\n");
    // Skip header row
    const dataRows = rows.slice(1);

    // Group updates by email sequentially picking strongest status
    const emailStatuses = {};

    dataRows.forEach(row => {
      const parts = row.split(",");
      const status = parts[0];
      const email = parts[4];
      const link = parts[7] || "";

      if (!emailStatuses[email]) {
        emailStatuses[email] = {
          emailSent: false,
          emailDelivered: false,
          emailOpened: false,
          whatsappClicked: false
        };
      }

      if (status === "Sent") emailStatuses[email].emailSent = true;
      if (status === "Delivered") emailStatuses[email].emailDelivered = true;
      if (status === "Opened" || status === "First opening") {
        emailStatuses[email].emailOpened = true;
        emailStatuses[email].emailDelivered = true; 
        emailStatuses[email].emailSent = true;
      }
      if (status === "Clicked" && link.includes("whatsapp")) {
        emailStatuses[email].whatsappClicked = true;
        emailStatuses[email].emailOpened = true;
        emailStatuses[email].emailDelivered = true;
        emailStatuses[email].emailSent = true;
      }
    });

    for (const [email, tracking] of Object.entries(emailStatuses)) {
      console.log(`Updating bookings for ${email}...`);
      await bookingModel.updateMany({ "address.email": email }, { $set: tracking });
    }

    // ✅ STEP 2: Fix status for all paid bookings that were created before
    // the "Confirmed" status was properly set (old tickets had other status strings)
    console.log("\n🔄 Fixing status for all paid (payment=true) bookings...");
    const fixResult = await bookingModel.updateMany(
      {
        payment: true,
        status: { $ne: "Confirmed" }  // only update those not already "Confirmed"
      },
      { $set: { status: "Confirmed" } }
    );
    console.log(`✅ Fixed status for ${fixResult.modifiedCount} bookings → set to "Confirmed"`);

    console.log("\n✅ Database Backfill Complete! All records mapped correctly based on the CSV dump.");
    process.exit(0);
  } catch (error) {
    console.error("Backfill Failed:", error);
    process.exit(1);
  }
};

processCSV();
