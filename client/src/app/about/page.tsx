import { Award, Users, Target, Eye, Heart, Stethoscope } from 'lucide-react';
import { Clock, Star } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-medical text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About POGS
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Patna Obstetric & Gynaecological Society
            </p>
            <p className="text-lg text-blue-50 max-w-3xl mx-auto">
              Dedicated to advancing excellence in women&apos;s healthcare through professional development, 
              research, and community service in Bihar since our inception.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="card p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Target className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To promote and advance the science and practice of obstetrics and gynaecology 
                in Bihar through education, research, and professional development. We strive 
                to improve women&apos;s healthcare outcomes by fostering excellence among medical 
                professionals and advocating for evidence-based practices in maternal and 
                reproductive health.
              </p>
            </div>

            {/* Vision */}
            <div className="card p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Eye className="text-green-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To be the leading medical society in Bihar for obstetrics and gynaecology, 
                recognized for our commitment to excellence, innovation, and compassionate 
                care. We envision a future where every woman in Bihar has access to the 
                highest quality reproductive healthcare services delivered by skilled and 
                knowledgeable professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                <Clock size={16} />
                <span>Founded 1958</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Visionary Founders</h2>
              <p className="text-gray-600">Pioneers of women&apos;s healthcare in Bihar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-8 md:p-10">
                <div className="flex items-center space-x-5 md:space-x-6">
                  <div className="relative flex-shrink-0">
                    <div className="relative w-24 h-32 md:w-28 md:h-36 rounded-2xl overflow-hidden border border-emerald-200 bg-emerald-50">
                      <Image src="/mp_john.png" alt="Dr. M.P. John" fill className="object-cover" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-emerald-400 rounded-full flex items-center justify-center">
                      <Star size={14} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Dr. M.P. John</h3>
                    <p className="text-base md:text-lg text-gray-600">The first lady Obstetrician &amp; Gynecologist of Bihar, founding president of POGS</p>
                    <p className="text-emerald-700 text-sm md:text-base mt-2">Founder President</p>
                  </div>
                </div>
              </div>

              <div className="card p-8 md:p-10">
                <div className="flex items-center space-x-5 md:space-x-6">
                  <div className="relative flex-shrink-0">
                    <div className="relative w-24 h-32 md:w-28 md:h-36 rounded-2xl overflow-hidden border border-teal-200 bg-teal-50">
                      <Image src="/sn_upadhyay.png" alt="Dr. S.N. Upadhyay" fill className="object-cover" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-teal-400 rounded-full flex items-center justify-center">
                      <Star size={14} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Dr. S.N. Upadhyay</h3>
                    <p className="text-base md:text-lg text-gray-600">Founding secretary of P.O.G.S., instrumental in establishing the society</p>
                    <p className="text-teal-700 text-sm md:text-base mt-2">Founder Secretary</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">Previously <span className="font-semibold">Bihar Obstetric and Gynaecological Society</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* History & Background */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our History
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A remarkable journey spanning over six decades, from humble beginnings in 1958 
                to establishing our own dedicated facility in the heart of Patna.
              </p>
            </div>

            <div className="space-y-8">
              {/* Foundation Story */}
              <div className="card p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Foundation (1958)</h3>
                    <p className="text-blue-600 font-medium">Bihar Obstetric and Gynaecological Society</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Bihar Obstetric and Gynaecological Society [Now Patna Obstetric and Gynaecological Society] was founded in the year 1958 in the department of Obstetric and Gynaecology of Patna Medical College Hospital in the library cum seminar room attached to Gynaecology outpatient department (GOPD).
                </p>
              </div>

              {/* Early Years */}
              <div className="card p-8 bg-slate-50">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Early Years (1958-1984)</h3>
                    <p className="text-green-600 font-medium">First Home at Patna Medical College</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  From 1958 to early 1984, the office of P.O.G.S. was functioning in the department of Obstetric and Gynaecology, P.M.C.H. in the library cum seminar room attached to GOPD. In the year 1984, under the Presidentship of Dr. Anmola Sinha, the office was shifted to a room in the Indian Medical Association building which is centrally located and has a bigger accommodation for holding meetings.
                </p>
              </div>

              {/* IMA Partnership */}
              <div className="card p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Partnership with IMA</h3>
                    <p className="text-purple-600 font-medium">Gratitude and Growth</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The society is thankful to the office bearers of I.M.A. for allowing the members of P.O.G.S. to hold meetings in seminar hall for many years without taking any charge.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Members of P.O.G.S. will ever remain grateful to The late Dr. P. Dutta (President IMA) & The late Dr. A.K.N. Sinha for allocating the space with partial construction to build the office of P.O.G.S. as per requirement.
                </p>
              </div>

              {/* FOGSI Conference Legacy */}
              <div className="card p-8 bg-blue-50">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">33rd AICOG Legacy (1989)</h3>
                    <p className="text-amber-600 font-medium">A Golden Achievement</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  A total sum of Rs. Five lacs five thousand nine hundred forty nine & paise ninety only (Rs. 5,05,949.90) was handed over to POGS by organising committee of 33rd All India Conference of FOGSI held at Patna in 1989, organised by Dr. Jagdishwari Mishra for construction of building – POGS office. The amount was part of the savings of 33rd AICOG.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  It gives immense pleasure to document the greatest achievement of society which is worth recording in golden letters in the history of P.O.G.S. — the very fact that the present space of POGS which is named as &quot;Obstetric &amp; Gynaecological Wing&quot; is because of the 33rd All India Congress of FOGSI held at Patna. Thus the long cherished desire to have our own office got fulfilled by the savings of 33rd AICOG.
                </p>
              </div>

              {/* Grand Opening */}
              <div className="card p-8 bg-gradient-to-r from-blue-50 to-green-50">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Inauguration (October 6, 1996)</h3>
                    <p className="text-emerald-600 font-medium">A Historic Milestone</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Finally on 6th Oct. 1996 during the Presidentship of Dr. Shanti Roy and Secretaryship of Dr. Pramila Modi, the newly constructed &quot;Obstetric &amp; Gynaecological Wing&quot; was inaugurated by His Excellency Dr. A. R. Kidwai, the then Governor of Bihar.
                </p>
              </div>

              {/* Current Facilities */}
              <div className="card p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Dedicated Facility</h3>
                    <p className="text-indigo-600 font-medium">Obstetric & Gynaecological Wing</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  The &quot;Obstetric and Gynaecological wing&quot; has a seminar hall which can accommodate 75 persons, one president suite, office space, 2 rest rooms, 1 pantry and a small balcony. The balcony was covered from all sides and was converted into a small library room of the society.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOGSI Affiliation */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <Award className="text-white" size={40} />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              FOGSI Affiliation
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              POGS is proudly affiliated with the Federation of Obstetric and Gynaecological 
              Societies of India (FOGSI), the premier national organization representing 
              obstetricians and gynaecologists across the country.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-blue-600" size={32} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">National Network</h4>
                <p className="text-gray-600">Access to nationwide medical expertise and resources</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-green-600" size={32} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Standards</h4>
                <p className="text-gray-600">Adherence to national standards and best practices</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-purple-600" size={32} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Recognition</h4>
                <p className="text-gray-600">National recognition and accreditation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 