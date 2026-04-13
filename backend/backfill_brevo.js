import mongoose from "mongoose";
import "dotenv/config";
import bookingModel from "./models/bookingsModel.js";

const csvData = `Clicked,14-04-2026 02:48:22,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<c5e37fd6-4cdf-4f36-df5e-50ce3a64dc3e@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,14-04-2026 02:48:13,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<c5e37fd6-4cdf-4f36-df5e-50ce3a64dc3e@gmail.com>,NA
Delivered,14-04-2026 02:47:48,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<c5e37fd6-4cdf-4f36-df5e-50ce3a64dc3e@gmail.com>,NA
Sent,14-04-2026 02:47:46,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<c5e37fd6-4cdf-4f36-df5e-50ce3a64dc3e@gmail.com>,NA
First opening,14-04-2026 02:35:24,Brevo API Test,groov.iti25@8984795.brevosend.com,groov.iti25@gmail.com,NA,<fc91b8a3-af98-cd57-15ac-9443d8b00100@gmail.com>,NA
Clicked,14-04-2026 02:31:42,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6e7d6bac-e2d5-374d-9192-e805ac9b2e3a@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
Opened,14-04-2026 02:31:29,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<ee2de9f2-3d50-6015-d600-a7432d27b054@gmail.com>,NA
First opening,14-04-2026 02:31:28,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6e7d6bac-e2d5-374d-9192-e805ac9b2e3a@gmail.com>,NA
Delivered,14-04-2026 02:30:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6e7d6bac-e2d5-374d-9192-e805ac9b2e3a@gmail.com>,NA
Sent,14-04-2026 02:30:47,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<6e7d6bac-e2d5-374d-9192-e805ac9b2e3a@gmail.com>,NA
First opening,14-04-2026 02:23:16,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<ee2de9f2-3d50-6015-d600-a7432d27b054@gmail.com>,NA
Delivered,14-04-2026 02:21:47,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<ee2de9f2-3d50-6015-d600-a7432d27b054@gmail.com>,NA
Sent,14-04-2026 02:21:45,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,swaroopmane21@gmail.com,NA,<ee2de9f2-3d50-6015-d600-a7432d27b054@gmail.com>,NA
Delivered,14-04-2026 02:15:52,Brevo API Test,groov.iti25@8984795.brevosend.com,groov.iti25@gmail.com,NA,<fc91b8a3-af98-cd57-15ac-9443d8b00100@gmail.com>,NA
Sent,14-04-2026 02:15:51,Brevo API Test,groov.iti25@8984795.brevosend.com,groov.iti25@gmail.com,NA,<fc91b8a3-af98-cd57-15ac-9443d8b00100@gmail.com>,NA
First opening,14-04-2026 02:12:25,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<d6b39a16-ad89-54ad-18aa-a1d3eeba5adc@gmail.com>,NA
Delivered,14-04-2026 02:12:12,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<d6b39a16-ad89-54ad-18aa-a1d3eeba5adc@gmail.com>,NA
Sent,14-04-2026 02:12:10,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,aditya.divate_comp23@pccoer.in,NA,<d6b39a16-ad89-54ad-18aa-a1d3eeba5adc@gmail.com>,NA
Clicked,14-04-2026 01:55:02,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,nersamiksha0206@gmail.com,NA,<5420180f-3fce-0956-eb33-e5b66d018722@gmail.com>,https://chat.whatsapp.com/G1mFjsA2Ac5JxBGqcAM1PM
First opening,14-04-2026 01:54:58,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,nersamiksha0206@gmail.com,NA,<5420180f-3fce-0956-eb33-e5b66d018722@gmail.com>,NA
Delivered,14-04-2026 01:54:40,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,nersamiksha0206@gmail.com,NA,<5420180f-3fce-0956-eb33-e5b66d018722@gmail.com>,NA
Sent,14-04-2026 01:54:38,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,nersamiksha0206@gmail.com,NA,<5420180f-3fce-0956-eb33-e5b66d018722@gmail.com>,NA
First opening,14-04-2026 01:27:50,🎟️ Your Event Ticket,groov.iti25@8984795.brevosend.com,ameyabobade007@gmail.com,NA,<b0a7a9a4-403b-c51c-ccc2-3f290e524246@gmail.com>,NA
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
