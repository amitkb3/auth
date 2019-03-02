import React from 'react';

import requireAuth from './requireAuth';

class Feature extends React.Component {
  render() {
    return(
      <div>
        This is a Feature
      </div>
    );
  }
}

export default requireAuth(Feature);