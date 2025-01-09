import { fetchLocationByID } from '@/lib/api';
import React, { useState, useEffect } from 'react';
import { useWorkLocation } from '@/hooks/useDataFetching';

interface WorkLocationProps {
  comp: string;
  loc: string;
}

export default function WorkLocation({ comp, loc }: WorkLocationProps) {
    const { location, isLoading } = useWorkLocation(comp, loc || '');
    if (isLoading) return <span className="text-gray-400">Loading...</span>;
    return <>{location}</>;
}