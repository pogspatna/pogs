'use client';
import { useState, useEffect } from 'react';
import { Search, Users, MapPin } from 'lucide-react';

interface Member {
  _id: string;
  name: string;
  address: string;
  membershipType: 'Life' | 'Annual';
  dateJoined: string;
  status: 'Active' | 'Inactive';
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.address.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [search, members]);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/members`);
      if (response.ok) {
        const data = await response.json();
        setMembers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-medical text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Member Directory
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Connect with our esteemed members across Bihar
            </p>
            <p className="text-lg text-blue-50 max-w-3xl mx-auto">
              Explore our directory of qualified obstetricians and gynaecologists 
              who are part of the POGS community.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-slate-50">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-20">
        <div className="container">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {search ? 'No members found' : 'No members available'}
              </h3>
              <p className="text-gray-600">
                {search ? 'Try adjusting your search terms' : 'Member directory will be updated soon'}
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Members
                </h2>
                <p className="text-lg text-gray-600">
                  {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMembers.map((member) => (
                  <div key={member._id} className="card p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.membershipType === 'Life' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {member.membershipType}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    
                    <div className="flex items-start space-x-2 mb-4">
                      <MapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {member.address}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Joined: {new Date(member.dateJoined).getFullYear()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 gradient-medical text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to Join Our Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Become part of Bihar's leading obstetrics and gynaecology society
          </p>
          <a href="/membership" className="btn-secondary">
            Apply for Membership
          </a>
        </div>
      </section>
    </div>
  );
} 