/**
 * Colors utilities
 */
import { UtilityCategory } from '../types';
import { colors } from '../tokens';

export const textColor: UtilityCategory = {
  'text-primary': `color: ${colors.text.primary}`,
  'text-secondary': `color: ${colors.text.secondary}`,
  'text-tertiary': `color: ${colors.text.tertiary}`,
  'text-disabled': `color: ${colors.text.disabled}`,
  'text-inverse': `color: ${colors.text.inverse}`,
  'text-link': `color: ${colors.text.link}`,
  'text-link-hover': `color: ${colors.text.linkHover}`,
  'text-link-active': `color: ${colors.text.linkActive}`,
  'text-link-visited': `color: ${colors.text.linkVisited}`,
  'text-success': `color: ${colors.text.success}`,
  'text-error': `color: ${colors.text.error}`,
  'text-warning': `color: ${colors.text.warning}`,
  'text-info': `color: ${colors.text.info}`,
  'text-accent': `color: ${colors.text.accent}`,
  'text-highlight': `color: ${colors.text.highlight}`,
  'text-placeholder': `color: ${colors.text.placeholder}`,
  'text-on-color': `color: ${colors.text.onColor}`,
  'text-caption': `color: ${colors.text.caption}`,
  'text-code': `color: ${colors.text.code}`,
};

export const backgroundColor: UtilityCategory = {
  'bg-primary': `background-color: ${colors.background.primary}`,
  'bg-secondary': `background-color: ${colors.background.secondary}`,
  'bg-tertiary': `background-color: ${colors.background.tertiary}`,
  'bg-disabled': `background-color: ${colors.background.disabled}`,
  'bg-inverse': `background-color: ${colors.background.inverse}`,
  'bg-info': `background-color: ${colors.background.info}`,
  'bg-success': `background-color: ${colors.background.success}`,
  'bg-error': `background-color: ${colors.background.error}`,
  'bg-warning': `background-color: ${colors.background.warning}`,
  'bg-overlay': `background-color: ${colors.background.overlay}`,
  'bg-scrim': `background-color: ${colors.background.scrim}`,
  'bg-spotlight': `background-color: ${colors.background.spotlight}`,
  'bg-input': `background-color: ${colors.background.input}`,
  'bg-card': `background-color: ${colors.background.card}`,
  'bg-modal': `background-color: ${colors.background.modal}`,
  'bg-toast': `background-color: ${colors.background.toast}`,
  'bg-tooltip': `background-color: ${colors.background.tooltip}`,
  'bg-dropdown': `background-color: ${colors.background.dropdown}`,
};

export const borderColor: UtilityCategory = {
  'border-primary': `border-color: ${colors.border.primary}`,
  'border-secondary': `border-color: ${colors.border.secondary}`,
  'border-tertiary': `border-color: ${colors.border.tertiary}`,
  'border-disabled': `border-color: ${colors.border.disabled}`,
  'border-inverse': `border-color: ${colors.border.inverse}`,
  'border-info': `border-color: ${colors.border.info}`,
  'border-success': `border-color: ${colors.border.success}`,
  'border-error': `border-color: ${colors.border.error}`,
  'border-warning': `border-color: ${colors.border.warning}`,
  'border-focus': `border-color: ${colors.border.focus}`,
  'border-hover': `border-color: ${colors.border.hover}`,
  'border-active': `border-color: ${colors.border.active}`,
  'border-selected': `border-color: ${colors.border.selected}`,
  'border-input': `border-color: ${colors.border.input}`,
  'border-card': `border-color: ${colors.border.card}`,
  'border-divider': `border-color: ${colors.border.divider}`,
  'border-modal': `border-color: ${colors.border.modal}`,
};