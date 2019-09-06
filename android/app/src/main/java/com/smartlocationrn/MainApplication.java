package com.smartlocationrn;

import android.app.Application;
import android.content.IntentFilter;

import com.facebook.react.ReactApplication;
import com.krazylabs.OpenAppSettingsPackage;
import cl.json.RNSharePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.vydia.RNUploader.UploaderReactPackage;
import com.microsoft.codepush.react.CodePush;
import org.wonday.pdf.RCTPdfView;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import com.theweflex.react.WeChatPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import cn.qiuxiang.react.geolocation.AMapGeolocationPackage;
import cn.qiuxiang.react.amap3d.AMap3DPackage;

import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.xinpure.wechatwork.RNWeChatWorkPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new OpenAppSettingsPackage(),
            new RNSharePackage(),
            new VectorIconsPackage(),
            new UploaderReactPackage(),
            new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new RCTPdfView(),
            new RNFetchBlobPackage(),
            new ReactNativeExceptionHandlerPackage(),
            new WeChatPackage(),
            new PickerPackage(),
            new FastImageViewPackage(),
            new AMapGeolocationPackage(),
            new AMap3DPackage(),
            new AsyncStoragePackage(),
            new RNGestureHandlerPackage(),
          new RNWeChatWorkPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
