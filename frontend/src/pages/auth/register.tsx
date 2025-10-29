import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { bootstrapStyles, BootstrapButton, colors, spacing, typography } from '../styles/bootstrapStyles';

type UserType = 'user' | 'admin' | 'collector';

export default function RegisterScreen() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user' as UserType,
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserTypeSelect = (userType: UserType) => {
    setFormData(prev => ({ ...prev, userType }));
  };

  const handleRegister = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (!formData.agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - replace with your teammate's actual authentication
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, always succeed
      Alert.alert('Success', `Welcome to TakaTrack as ${getUserTypeConfig(formData.userType).title}!`, [
        {
          text: 'Continue',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    }, 1500);
  };

  const getUserTypeConfig = (type: UserType) => {
    const config = {
      user: {
        icon: 'person',
        title: 'TakaTrack User',
        description: 'Track your recycling and manage waste',
        color: colors.primary,
      },
      admin: {
        icon: 'shield',
        title: 'Administrator',
        description: 'Manage system and view analytics',
        color: colors.info,
      },
      collector: {
        icon: 'business',
        title: 'Collector',
        description: 'Manage collections and routes',
        color: colors.success,
      },
    };
    return config[type];
  };

  return (
    <ScrollView style={[bootstrapStyles.container, { padding: spacing[4] }]} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header Section */}
      <View style={{ alignItems: 'center', marginBottom: spacing[6], marginTop: spacing[4] }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing[4],
        }}>
          <Ionicons name="leaf" size={40} color={colors.white} />
        </View>
        <Text style={[typography.h3, { color: colors.primary, marginBottom: spacing[2] }]}>
          Join TakaTrack
        </Text>
        <Text style={[typography.body, { color: colors.gray600, textAlign: 'center' }]}>
          Create your account and start your sustainable journey
        </Text>
      </View>

      {/* User Type Selection */}
      <View style={{ marginBottom: spacing[4] }}>
        <Text style={[typography.h6, { marginBottom: spacing[3], textAlign: 'center' }]}>
          I want to join as a...
        </Text>
        <View style={bootstrapStyles.row}>
          {(['user', 'admin', 'collector'] as UserType[]).map((type) => {
            const config = getUserTypeConfig(type);
            const isSelected = formData.userType === type;
            
            return (
              <View key={type} style={[bootstrapStyles.col4, { marginBottom: spacing[2] }]}>
                <TouchableOpacity
                  style={[
                    bootstrapStyles.card,
                    {
                      alignItems: 'center',
                      padding: spacing[2],
                      borderWidth: 2,
                      borderColor: isSelected ? config.color : colors.gray300,
                      backgroundColor: isSelected ? `${config.color}10` : colors.white,
                    }
                  ]}
                  onPress={() => handleUserTypeSelect(type)}
                >
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: isSelected ? config.color : colors.gray200,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: spacing[1],
                  }}>
                    <Ionicons name={config.icon as any} size={20} color={isSelected ? colors.white : colors.gray600} />
                  </View>
                  <Text style={[
                    typography.small,
                    { 
                      fontWeight: '600',
                      textAlign: 'center',
                      color: isSelected ? config.color : colors.gray600
                    }
                  ]}>
                    {config.title}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        
        {/* User Type Description */}
        <View style={{
          backgroundColor: `${getUserTypeConfig(formData.userType).color}10`,
          padding: spacing[3],
          borderRadius: 8,
          marginTop: spacing[2],
          borderLeftWidth: 4,
          borderLeftColor: getUserTypeConfig(formData.userType).color,
        }}>
          <Text style={[typography.small, { color: colors.gray700, fontWeight: '600' }]}>
            {getUserTypeConfig(formData.userType).title}
          </Text>
          <Text style={[typography.small, { color: colors.gray600, marginTop: 2 }]}>
            {getUserTypeConfig(formData.userType).description}
          </Text>
        </View>
      </View>

      {/* Registration Form */}
      <View style={bootstrapStyles.card}>
        <View style={bootstrapStyles.cardBody}>
          {/* Full Name Input */}
          <View style={bootstrapStyles.formGroup}>
            <Text style={bootstrapStyles.formLabel}>Full Name</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[bootstrapStyles.formControl, { paddingLeft: spacing[9] }]}
                value={formData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
                placeholder="Enter your full name"
                placeholderTextColor={colors.gray500}
                autoCapitalize="words"
              />
              <View style={{
                position: 'absolute',
                left: spacing[3],
                top: spacing[2],
                zIndex: 1,
              }}>
                <Ionicons name="person" size={20} color={colors.gray500} />
              </View>
            </View>
          </View>

          {/* Email Input */}
          <View style={bootstrapStyles.formGroup}>
            <Text style={bootstrapStyles.formLabel}>Email Address</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[bootstrapStyles.formControl, { paddingLeft: spacing[9] }]}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter your email"
                placeholderTextColor={colors.gray500}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={{
                position: 'absolute',
                left: spacing[3],
                top: spacing[2],
                zIndex: 1,
              }}>
                <Ionicons name="mail" size={20} color={colors.gray500} />
              </View>
            </View>
          </View>

          {/* Password Input */}
          <View style={bootstrapStyles.formGroup}>
            <Text style={bootstrapStyles.formLabel}>Password</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[bootstrapStyles.formControl, { paddingLeft: spacing[9], paddingRight: spacing[9] }]}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                placeholder="Create a password"
                placeholderTextColor={colors.gray500}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <View style={{
                position: 'absolute',
                left: spacing[3],
                top: spacing[2],
                zIndex: 1,
              }}>
                <Ionicons name="lock-closed" size={20} color={colors.gray500} />
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: spacing[3],
                  top: spacing[2],
                  zIndex: 1,
                }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.gray500}
                />
              </TouchableOpacity>
            </View>
            <Text style={[typography.small, { color: colors.gray600, marginTop: spacing[1] }]}>
              Must be at least 8 characters long
            </Text>
          </View>

          {/* Confirm Password Input */}
          <View style={bootstrapStyles.formGroup}>
            <Text style={bootstrapStyles.formLabel}>Confirm Password</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                style={[bootstrapStyles.formControl, { paddingLeft: spacing[9], paddingRight: spacing[9] }]}
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                placeholder="Confirm your password"
                placeholderTextColor={colors.gray500}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <View style={{
                position: 'absolute',
                left: spacing[3],
                top: spacing[2],
                zIndex: 1,
              }}>
                <Ionicons name="lock-closed" size={20} color={colors.gray500} />
              </View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: spacing[3],
                  top: spacing[2],
                  zIndex: 1,
                }}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.gray500}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms Agreement */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing[4] }}>
            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'flex-start',
                flex: 1 
              }}
              onPress={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: formData.agreeToTerms ? colors.primary : colors.gray400,
                marginRight: spacing[2],
                marginTop: 2,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: formData.agreeToTerms ? colors.primary : 'transparent',
              }}>
                {formData.agreeToTerms && (
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[typography.small, { color: colors.gray700 }]}>
                  I agree to the{' '}
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <BootstrapButton
            title={`Create ${getUserTypeConfig(formData.userType).title} Account`}
            onPress={handleRegister}
            loading={isLoading}
            style={{ width: '100%', marginBottom: spacing[3] }}
          />
        </View>
      </View>

      {/* Sign In Link */}
      <View style={{ alignItems: 'center', marginTop: spacing[4], marginBottom: spacing[6] }}>
        <Text style={[typography.body, { color: colors.gray600 }]}>
          Already have an account?{' '}
          <Link href="/auth/login" asChild>
            <TouchableOpacity>
              <Text style={[typography.body, { color: colors.primary, fontWeight: '600' }]}>
                Sign in
              </Text>
            </TouchableOpacity>
          </Link>
        </Text>
      </View>

      {/* App Info */}
      <View style={{ alignItems: 'center', marginTop: 'auto' }}>
        <Text style={[typography.small, { color: colors.gray600 }]}>
          TakaTrack v1.0.0
        </Text>
        <Text style={[typography.small, { color: colors.gray600 }]}>
          Making the world greener, one recycle at a time ♻️
        </Text>
      </View>
    </ScrollView>
  );
}