interface HeadingTitleProps {
  title: string;
  subtitle?: string;
}

export const HeadingTitle = ({ title, subtitle }: HeadingTitleProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 mb-2 sm:mb-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
        {title}
      </h2>
      <div className="w-12 sm:w-16 h-1 bg-primary rounded-full mt-2" />
      {subtitle && (
        <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-2 max-w-md">
          {subtitle}
        </p>
      )}
    </div>
  );
};
