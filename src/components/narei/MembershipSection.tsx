import React from 'react';
import MembershipTiers from './MembershipTiers';

const MembershipSection: React.FC = () => {
  return (
    <section id="membership" className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Membership</h2>
          <p className="text-xl text-blue-100">Invest in your success with the right membership tier</p>
        </div>

        <MembershipTiers />
      </div>
    </section>
  );
};

export default MembershipSection;
