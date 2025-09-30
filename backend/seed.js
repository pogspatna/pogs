const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');

// Import models
const Member = require('./models/Member');
const Event = require('./models/Event');
const OfficeBearer = require('./models/OfficeBearer');
const Newsletter = require('./models/Newsletter');
const ContactInquiry = require('./models/ContactInquiry');

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pogs_db';

async function seedDatabase() {
  try {
    await mongoose.connect(mongoUri);
    
    // Check if data already exists
    const existingMembers = await Member.countDocuments();
    const existingEvents = await Event.countDocuments();
    const existingOfficeBearers = await OfficeBearer.countDocuments();
    const existingNewsletters = await Newsletter.countDocuments();
    const existingContactInquiries = await ContactInquiry.countDocuments();
    
    if (existingMembers > 0 || existingEvents > 0 || existingOfficeBearers > 0 || existingNewsletters > 0 || existingContactInquiries > 0) {
      console.log('Database already contains data. Skipping seed to prevent data loss.');
      console.log(`Found: ${existingMembers} members, ${existingEvents} events, ${existingOfficeBearers} office bearers, ${existingNewsletters} newsletters, ${existingContactInquiries} contact inquiries`);
      process.exit(0);
    }
    
    console.log('Database is empty. Proceeding with seed data...');
    console.log('⚠️  WARNING: This will insert sample data. Only run this on empty databases!');

    // Sample Members
    const members = [
      {
        name: 'Dr. Priya Sharma',
        address: 'Kankarbagh, Patna, Bihar',
        membershipType: 'Life',
        dateJoined: new Date('2020-01-15'),
        status: 'Active'
      },
      {
        name: 'Dr. Rajesh Kumar',
        address: 'Boring Road, Patna, Bihar',
        membershipType: 'Annual',
        dateJoined: new Date('2022-03-10'),
        status: 'Active'
      },
      {
        name: 'Dr. Sunita Devi',
        address: 'Frazer Road, Patna, Bihar',
        membershipType: 'Life',
        dateJoined: new Date('2019-07-22'),
        status: 'Active'
      },
      {
        name: 'Dr. Amit Singh',
        address: 'Patliputra Colony, Patna, Bihar',
        membershipType: 'Life',
        dateJoined: new Date('2021-11-05'),
        status: 'Active'
      },
      {
        name: 'Dr. Kavita Gupta',
        address: 'Bailey Road, Patna, Bihar',
        membershipType: 'Annual',
        dateJoined: new Date('2023-02-14'),
        status: 'Active'
      }
    ];

    // Sample Events
    const events = [
      {
        name: 'Annual POGS Conference 2024',
        shortDescription: 'Annual conference on latest developments in O&G',
        detailedDescription: 'Join us for our annual conference featuring renowned speakers, latest research presentations, and networking opportunities for all members of the obstetrics and gynaecology community.',
        date: new Date('2024-12-15'),
        location: 'Hotel Maurya, Patna',
        status: 'Upcoming'
      },
      {
        name: 'CME on High Risk Pregnancy',
        shortDescription: 'Continuing Medical Education program on high-risk pregnancies',
        detailedDescription: 'An intensive CME program covering the latest guidelines and management protocols for high-risk pregnancies, including case discussions and interactive sessions.',
        date: new Date('2024-11-20'),
        location: 'PMCH Auditorium, Patna',
        status: 'Upcoming'
      },
      {
        name: 'Workshop on Laparoscopic Surgery',
        shortDescription: 'Hands-on workshop on minimally invasive surgical techniques',
        detailedDescription: 'A comprehensive workshop focusing on advanced laparoscopic techniques in gynaecology with live demonstrations and hands-on training sessions.',
        date: new Date('2024-10-10'),
        location: 'AIIMS Patna',
        status: 'Past'
      }
    ];

    // Sample Office Bearers
    const officeBearers = [
      {
        name: 'Dr. Anil Kumar Sinha',
        designation: 'President',
        year: 2024,
        isCurrent: true,
        order: 1
      },
      {
        name: 'Dr. Meera Pandey',
        designation: 'Vice President',
        year: 2024,
        isCurrent: true,
        order: 2
      },
      {
        name: 'Dr. Ravi Shankar',
        designation: 'Secretary',
        year: 2024,
        isCurrent: true,
        order: 3
      },
      {
        name: 'Dr. Neetu Singh',
        designation: 'Treasurer',
        year: 2024,
        isCurrent: true,
        order: 4
      },
      {
        name: 'Dr. Suresh Prasad',
        designation: 'President',
        year: 2023,
        isCurrent: false,
        order: 1
      }
    ];

    // Sample Newsletters
    const newsletters = [
      {
        title: 'POGS Newsletter - January 2024',
        pdfUrl: 'sample_newsletter_jan_2024.pdf',
        publishDate: new Date('2024-01-01')
      },
      {
        title: 'POGS Newsletter - October 2023',
        pdfUrl: 'sample_newsletter_oct_2023.pdf',
        publishDate: new Date('2023-10-01')
      },
      {
        title: 'POGS Newsletter - July 2023',
        pdfUrl: 'sample_newsletter_jul_2023.pdf',
        publishDate: new Date('2023-07-01')
      }
    ];

    // Insert sample data
    await Member.insertMany(members);
    await Event.insertMany(events);
    await OfficeBearer.insertMany(officeBearers);
    await Newsletter.insertMany(newsletters);

    console.log('Sample data inserted successfully!');
    console.log(`${members.length} members added`);
    console.log(`${events.length} events added`);
    console.log(`${officeBearers.length} office bearers added`);
    console.log(`${newsletters.length} newsletters added`);

    process.exit(0);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Seeding failed:', error);
    }
    process.exit(1);
  }
}

seedDatabase(); 