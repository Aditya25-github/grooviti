'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { addDays, format, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import {
  createContext,
  useContext,
} from 'react';
import './mini-calendar.css';

// Utility function for class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Context for sharing state between components
const MiniCalendarContext = createContext(null);

const useMiniCalendar = () => {
  const context = useContext(MiniCalendarContext);
  if (!context) {
    throw new Error('MiniCalendar components must be used within MiniCalendar');
  }
  return context;
};

// Helper function to get array of consecutive dates
const getDays = (startDate, count) => {
  const days = [];
  for (let i = 0; i < count; i++) {
    days.push(addDays(startDate, i));
  }
  return days;
};

// Helper function to format date
const formatDate = (date) => {
  const month = format(date, 'MMM');
  const day = format(date, 'd');
  return { month, day };
};

// Simple Button component
const Button = ({ 
  children, 
  onClick, 
  className, 
  variant = 'default',
  size = 'default',
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    icon: 'h-10 w-10',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export const MiniCalendar = ({
  value,
  defaultValue,
  onValueChange,
  startDate,
  defaultStartDate = new Date(),
  onStartDateChange,
  days = 5,
  className,
  children,
  ...props
}) => {
  const [selectedDate, setSelectedDate] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const [currentStartDate, setCurrentStartDate] = useControllableState({
    prop: startDate,
    defaultProp: defaultStartDate,
    onChange: onStartDateChange,
  });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleNavigate = (direction) => {
    const newStartDate = addDays(
      currentStartDate || new Date(),
      direction === 'next' ? days : -days
    );
    setCurrentStartDate(newStartDate);
  };

  const contextValue = {
    selectedDate: selectedDate || null,
    onDateSelect: handleDateSelect,
    startDate: currentStartDate || new Date(),
    onNavigate: handleNavigate,
    days,
  };

  return (
    <MiniCalendarContext.Provider value={contextValue}>
      <div
        className={cn('miniCalendar', className)}
        {...props}
      >
        {children}
      </div>
    </MiniCalendarContext.Provider>
  );
};

export const MiniCalendarNavigation = ({
  direction,
  asChild = false,
  children,
  onClick,
  className,
  ...props
}) => {
  const { onNavigate } = useMiniCalendar();
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  const handleClick = (event) => {
    onNavigate(direction);
    onClick?.(event);
  };

  if (asChild) {
    return (
      <Slot onClick={handleClick} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <Button
      onClick={handleClick}
      size={asChild ? undefined : 'icon'}
      type="button"
      variant={asChild ? undefined : 'ghost'}
      className={cn('calendarNav', className)}
      {...props}
    >
      {children ?? <Icon className="h-4 w-4" />}
    </Button>
  );
};

export const MiniCalendarDays = ({
  className,
  children,
  ...props
}) => {
  const { startDate, days: dayCount } = useMiniCalendar();
  const days = getDays(startDate, dayCount);

  return (
    <div className={cn('calendarDays', className)} {...props}>
      {days.map((date) => children(date))}
    </div>
  );
};

export const MiniCalendarDay = ({
  date,
  className,
  ...props
}) => {
  const { selectedDate, onDateSelect } = useMiniCalendar();
  const { month, day } = formatDate(date);
  const isSelected = selectedDate && isSameDay(date, selectedDate);
  const isTodayDate = isToday(date);

  return (
    <Button
      className={cn(
        'calendarDay',
        isTodayDate && !isSelected && 'today',
        isSelected && 'selected',
        className
      )}
      onClick={() => onDateSelect(date)}
      size="sm"
      type="button"
      variant={isSelected ? 'default' : 'ghost'}
      {...props}
    >
      <span className="month">{month}</span>
      <span className="day">{day}</span>
    </Button>
  );
};
