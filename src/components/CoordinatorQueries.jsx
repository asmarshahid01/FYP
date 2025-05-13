import React from 'react';
import CoordinatorLeftBar from './CoordinatorLeftBar';

const CoordinatorQueries = () => {
	return (
		<div className='flex h-screen'>
			<CoordinatorLeftBar />
			<div className='flex-1 p-8 text-black'>
				<h1 className='text-2xl font-bold mb-4'>Coordinator Queries</h1>
				<p>This is the Coordinator Queries page. Display queries here.</p>
			</div>
		</div>
	);
};

export default CoordinatorQueries;
