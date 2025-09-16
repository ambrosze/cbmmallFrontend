import React from "react";

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const ProfileSection: React.FC<Props> = ({
  title,
  description,
  children,
  actions,
}) => {
  return (
    <section className="mt-10 first:mt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1 max-w-xl">{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
      {children}
    </section>
  );
};

export default ProfileSection;
