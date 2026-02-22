// components/Loader.js

import React from 'react';
import { MutatingDots } from 'react-loader-spinner';
import PropTypes from 'prop-types';

const Loader = ({
    message = 'Loading...',
    color = '#4fa94d',
    height = 100,
    width = 100,
    visible = true,
}) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80  backdrop-blur-sm">
            <MutatingDots
                height={height}
                width={width}
                color={color}
                secondaryColor={color}
                radius={12.5}
                ariaLabel="mutating-dots-loading"
                visible={visible}
            />
            {message && (
                <p className="mt-4 text-gray-800  text-base font-medium">
                    {message}
                </p>
            )}
        </div>
    );
};

Loader.propTypes = {
    message: PropTypes.string,
    color: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    visible: PropTypes.bool,
};

export default Loader;
