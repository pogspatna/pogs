import { Mic, Heart, Stethoscope, Users, Award, Target } from 'lucide-react';

export default function OrationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-medical text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mic className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Oration
            </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Patna Obstetric & Gynaecological Society
                </p>
            <p className="text-lg text-blue-50 max-w-3xl mx-auto">
              Honoring excellence in women&apos;s healthcare through distinguished orations and recognition of outstanding contributions to the field of obstetrics and gynaecology.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 md:p-12">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Distinguished Oration Program
                </h2>
                <p className="text-lg text-gray-600">
                  Celebrating Excellence in Women&apos;s Healthcare
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  The Patna Obstetric & Gynaecological Society (POGS) is proud to present our distinguished 
                  Oration Program, a prestigious platform that recognizes and honors exceptional contributions 
                  to the field of obstetrics and gynaecology. This program serves as a cornerstone of our 
                  commitment to advancing women&apos;s healthcare through knowledge sharing, innovation, and 
                  professional excellence.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Our oration series brings together leading experts, researchers, and practitioners who have 
                  made significant strides in improving maternal and reproductive health outcomes. Through 
                  these distinguished presentations, we aim to foster a culture of continuous learning, 
                  evidence-based practice, and collaborative advancement in women&apos;s healthcare.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 my-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Our Vision for Excellence</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Through our oration program, we envision a future where every woman receives the highest 
                    standard of care, where medical professionals are equipped with the latest knowledge and 
                    techniques, and where innovation in women&apos;s healthcare continues to flourish. We believe 
                    that by honoring excellence and sharing knowledge, we can collectively transform the 
                    landscape of maternal and reproductive health in Bihar and beyond.
                  </p>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  The POGS Oration Program features distinguished speakers who have contributed significantly 
                  to research, clinical practice, education, and policy development in obstetrics and 
                  gynaecology. These orations cover a wide range of topics including maternal mortality 
                  reduction, reproductive health innovations, medical education advancements, and healthcare 
                  policy improvements.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                  <div className="text-center p-6 bg-white border border-gray-200 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Stethoscope className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Clinical Excellence</h4>
                    <p className="text-sm text-gray-600">Recognizing outstanding clinical practice and patient care innovations</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white border border-gray-200 rounded-xl">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Research Leadership</h4>
                    <p className="text-sm text-gray-600">Honoring groundbreaking research and scientific contributions</p>
                  </div>
                  
                  <div className="text-center p-6 bg-white border border-gray-200 rounded-xl">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Target className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Educational Impact</h4>
                    <p className="text-sm text-gray-600">Celebrating contributions to medical education and training</p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  We invite the medical community, healthcare professionals, researchers, and students to 
                  participate in our oration program. These events provide valuable opportunities for 
                  professional development, networking, and staying abreast of the latest developments in 
                  women&apos;s healthcare. Through these distinguished orations, POGS continues to uphold its 
                  mission of advancing excellence in obstetrics and gynaecology while serving the healthcare 
                  needs of women in Bihar and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container">
          <div className="text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Join Our Oration Program
            </h3>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Be part of our mission to advance women&apos;s healthcare through knowledge sharing and professional excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Contact Us
              </a>
              <a
                href="/events"
                className="bg-blue-500 text-white hover:bg-blue-400 font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View Events
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
