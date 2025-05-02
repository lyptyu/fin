<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  name: '',
  gender: '男',
  age: '',
  idType: '身份证',
  idNumber: '',
  province: '',
  city: '',
  householdType: '',
  villageGroup: '',
  maritalStatus: '',
  canKnow: '',
  canSign: '',
  creditMarriage: '',
  education: '',
  canVerify: '',
  isFullTime: '',
  remark: '',
  hasLicense: '',
  spouseLicense: '',
  familyLicense: '',
  // 新增字段
  requirement: '',
  carType: '',
  financingRange: '',
  specialNote: '',
})

function onSubmit(values: any) {
  console.log('form submit', values)
}
</script>

<template>
  <div class="base-info">
    <van-form @submit="onSubmit">
      <!-- 基本信息 -->
      <van-cell-group inset title="基本信息">
        <van-field v-model="formData.name" label="姓名" placeholder="请输入姓名" :rules="[{ required: true, message: '请输入姓名' }]" />

        <van-field name="gender" label="性别">
          <template #input>
            <van-radio-group v-model="formData.gender" direction="horizontal">
              <van-radio name="男">
                男
              </van-radio>
              <van-radio name="女">
                女
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field v-model="formData.age" type="number" label="年龄" placeholder="请输入年龄" />

        <van-field name="idType" label="证件类型">
          <template #input>
            <van-radio-group v-model="formData.idType" direction="horizontal">
              <van-radio name="身份证">
                身份证
              </van-radio>
              <van-radio name="港澳通行证">
                港澳通行证
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field v-model="formData.idNumber" label="证件号码" placeholder="请输入证件号码" />
      </van-cell-group>

      <!-- 户籍信息 -->
      <van-cell-group inset title="户籍信息">
        <van-field v-model="formData.province" label="省份" placeholder="请选择省份" />
        <van-field v-model="formData.city" label="城市" placeholder="请选择城市" />

        <van-field v-show="formData.province && formData.city" name="householdType" label="户籍属性">
          <template #input>
            <van-radio-group v-model="formData.householdType" direction="horizontal">
              <van-radio name="农村">
                农村
              </van-radio>
              <van-radio name="城镇">
                城镇
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field v-show="formData.householdType === '农村'" name="villageGroup" label="是否含村组">
          <template #input>
            <van-radio-group v-model="formData.villageGroup" direction="horizontal">
              <van-radio name="不含村组">
                不含村组
              </van-radio>
              <van-radio name="含村不含组">
                含村不含组
              </van-radio>
              <van-radio name="含组不含村">
                含组不含村
              </van-radio>
              <van-radio name="含村组">
                含村组
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 婚姻状态 -->
      <van-cell-group inset title="婚姻状态">
        <van-field name="maritalStatus" label="婚姻状态">
          <template #input>
            <van-radio-group v-model="formData.maritalStatus" direction="horizontal">
              <van-radio name="已婚">
                已婚
              </van-radio>
              <van-radio name="未婚">
                未婚
              </van-radio>
              <van-radio name="离异">
                离异
              </van-radio>
              <van-radio name="丧偶">
                丧偶
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <template v-if="formData.maritalStatus === '已婚'">
          <van-field name="canKnow" label="是否可知情">
            <template #input>
              <van-radio-group v-model="formData.canKnow" direction="horizontal">
                <van-radio name="是">
                  是
                </van-radio>
                <van-radio name="否">
                  否
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field v-show="formData.canKnow === '是'" name="canSign" label="是否可共签">
            <template #input>
              <van-radio-group v-model="formData.canSign" direction="horizontal">
                <van-radio name="是">
                  是
                </van-radio>
                <van-radio name="否">
                  否
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </template>
      </van-cell-group>

      <!-- 婚姻征信 -->
      <van-cell-group inset title="婚姻征信">
        <van-field name="creditMarriage" label="婚姻征信">
          <template #input>
            <van-radio-group v-model="formData.creditMarriage" direction="horizontal">
              <van-radio name="不显示">
                不显示
              </van-radio>
              <van-radio name="已婚">
                已婚
              </van-radio>
              <van-radio name="未婚">
                未婚
              </van-radio>
              <van-radio name="离异">
                离异
              </van-radio>
              <van-radio name="丧偶">
                丧偶
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 学历情况 -->
      <van-cell-group inset title="学历情况">
        <van-field name="education" label="学历">
          <template #input>
            <van-radio-group v-model="formData.education" direction="horizontal">
              <van-radio name="小学">
                小学
              </van-radio>
              <van-radio name="初中">
                初中
              </van-radio>
              <van-radio name="高中">
                高中
              </van-radio>
              <van-radio name="大专">
                大专
              </van-radio>
              <van-radio name="本科">
                本科
              </van-radio>
              <van-radio name="硕士">
                硕士
              </van-radio>
              <van-radio name="博士">
                博士
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <template v-if="['大专', '本科', '硕士', '博士'].includes(formData.education)">
          <van-field name="canVerify" label="学信网是否可查">
            <template #input>
              <van-radio-group v-model="formData.canVerify" direction="horizontal">
                <van-radio name="是">
                  是
                </van-radio>
                <van-radio name="否">
                  否
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field v-show="formData.canVerify === '是'" name="isFullTime" label="是否全日制">
            <template #input>
              <van-radio-group v-model="formData.isFullTime" direction="horizontal">
                <van-radio name="是">
                  是
                </van-radio>
                <van-radio name="否">
                  否
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field
            v-show="formData.isFullTime === '否'"
            v-model="formData.remark"
            label="备注"
            type="textarea"
            placeholder="请输入备注"
          />
        </template>
      </van-cell-group>

      <!-- 驾照情况 -->
      <van-cell-group inset title="驾照情况">
        <van-field name="hasLicense" label="本人驾照">
          <template #input>
            <van-radio-group v-model="formData.hasLicense" direction="horizontal">
              <van-radio name="有">
                有
              </van-radio>
              <van-radio name="无">
                无
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <template v-if="formData.hasLicense === '无'">
          <van-field name="spouseLicense" label="配偶驾照情况">
            <template #input>
              <van-radio-group v-model="formData.spouseLicense" direction="horizontal">
                <van-radio name="有">
                  有
                </van-radio>
                <van-radio name="无">
                  无
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field v-show="formData.spouseLicense === '无'" name="familyLicense" label="直系（非配偶）驾照情况">
            <template #input>
              <van-radio-group v-model="formData.familyLicense" direction="horizontal">
                <van-radio name="直系无驾照">
                  直系无驾照
                </van-radio>
                <van-radio name="父亲驾照">
                  父亲驾照
                </van-radio>
                <van-radio name="母亲驾照">
                  母亲驾照
                </van-radio>
                <van-radio name="儿子驾照">
                  儿子驾照
                </van-radio>
                <van-radio name="女儿驾照">
                  女儿驾照
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </template>
      </van-cell-group>

      <!-- 要求 -->
      <van-cell-group inset title="要求">
        <van-field name="requirement" label="客户需求">
          <template #input>
            <van-radio-group v-model="formData.requirement" direction="horizontal">
              <van-radio name="买车">
                买车
              </van-radio>
              <van-radio name="融资">
                融资
              </van-radio>
              <van-radio name="买车+融资">
                买车+融资
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          v-show="formData.requirement === '买车' || formData.requirement === '买车+融资'"
          v-model="formData.carType"
          label="意向车型"
          placeholder="请输入意向车型"
        />

        <van-field
          v-show="formData.requirement === '融资' || formData.requirement === '买车+融资'"
          v-model="formData.financingRange"
          label="融资区间"
          placeholder="请输入融资区间"
        />

        <van-field
          v-model="formData.specialNote"
          label="客户特别嘱咐"
          type="textarea"
          placeholder="请输入客户特别嘱咐"
        />
      </van-cell-group>

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped>
.base-info {
  padding: 16px 0;
}
</style>
