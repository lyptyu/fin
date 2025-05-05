<template>
  <div class="last-examine">
    <van-nav-bar
      title="征信补充信息"
      left-arrow
      @click-left="onClickLeft"
      class="custom-nav"
    >
      <template #right>
        <van-button 
          type="primary" 
          size="small" 
          class="save-btn"
          @click="saveModule1"
        >
          暂存
        </van-button>
      </template>
    </van-nav-bar>
    
    <div class="content">
      <!-- 模块1：本人征信及黑灰名单细节补充 -->
      <van-cell-group inset class="module-group">
        <van-cell title="本人征信及黑灰名单细节补充" class="module-title">
          <template #icon>
            <van-icon name="shield-o" class="module-icon" />
          </template>
        </van-cell>
        <div class="module-content">
          <!-- 01近半年查询记录 -->
          <div class="section">
            <div class="section-title">01近半年以下查询记录的原因及细节</div>
            <div v-for="(record, index) in module1Data.queryRecords" :key="index" class="record-item">
              <div class="record-header">
                <span class="record-date">{{ record.date }}</span>
                <span class="record-org">{{ record.org }}</span>
              </div>
              
              <div class="radio-title">申请贷款类型：</div>
              <van-radio-group v-model="record.loanType" direction="horizontal" class="radio-group">
                <van-radio name="装修贷">装修贷</van-radio>
                <van-radio name="车贷">车贷</van-radio>
                <van-radio name="信贷">信贷</van-radio>
                <van-radio name="其它">其它</van-radio>
              </van-radio-group>

              <div class="radio-title">后续进度：</div>
              <van-radio-group v-model="record.progress" direction="horizontal" class="radio-group">
                <van-radio name="已批-未放款">已批-未放款</van-radio>
                <van-radio name="已批-已放款">已批-已放款</van-radio>
                <van-radio name="已拒">已拒</van-radio>
              </van-radio-group>

              <div class="form-item required" v-if="record.progress === '已拒'">
                <div class="radio-title">拒绝原因：</div>
                <van-field
                  v-model="record.rejectReason"
                  placeholder="请输入拒绝原因"
                  class="reject-reason"
                  :rules="[{ required: true, message: '请输入拒绝原因' }]"
                />
              </div>
            </div>
          </div>

          <!-- 02近五年未结清 -->
          <div class="section">
            <div class="section-title">02近五年未结清的以下机构补充</div>
            <div v-for="(loan, index) in module1Data.unpaidLoans" :key="index" class="loan-item">
              <div class="loan-header">
                <span class="loan-date">{{ loan.date }}</span>
                <span class="loan-org">{{ loan.org }}</span>
                <span class="loan-amount">{{ loan.amount }}</span>
                <span class="loan-progress">{{ loan.progress }}</span>
              </div>
              
              <van-radio-group v-model="loan.loanType" direction="horizontal" class="radio-group">
                <van-radio name="装修贷">装修贷</van-radio>
                <van-radio name="车贷">车贷</van-radio>
                <van-radio name="信贷">信贷</van-radio>
                <van-radio name="其它">其它</van-radio>
              </van-radio-group>
            </div>
          </div>

          <!-- 03历史黑灰名单 -->
          <div class="section">
            <div class="section-title">03历史(含5年外)以下机构黑灰名单情况</div>
            <van-checkbox-group v-model="module1Data.blacklistOrgs" direction="horizontal" class="checkbox-group">
              <van-checkbox name="中行">中行</van-checkbox>
              <van-checkbox name="农行">农行</van-checkbox>
              <van-checkbox name="工行">工行</van-checkbox>
              <van-checkbox name="建行">建行</van-checkbox>
              <van-checkbox name="邮储">邮储</van-checkbox>
              <van-checkbox name="广发">广发</van-checkbox>
              <van-checkbox name="招行">招行</van-checkbox>
              <van-checkbox name="光大">光大</van-checkbox>
              <van-checkbox name="中信">中信</van-checkbox>
            </van-checkbox-group>

            <div v-for="org in module1Data.blacklistOrgs" :key="org" class="blacklist-reason">
              <van-field
                v-model="module1Data.blacklistReasons[org]"
                :label="org + '黑灰名单原因'"
                placeholder="请输入黑灰名单原因"
                :rules="[{ required: true, message: '请填写黑灰名单原因' }]"
              />
            </div>
          </div>

          <!-- 04历史被拒记录 -->
          <div class="section">
            <div class="section-title">04历史(含5年外)以下机构被拒记录情况</div>
            <van-checkbox-group v-model="module1Data.rejectedOrgs" direction="horizontal" class="checkbox-group">
              <van-checkbox name="中行">中行</van-checkbox>
              <van-checkbox name="农行">农行</van-checkbox>
              <van-checkbox name="工行">工行</van-checkbox>
              <van-checkbox name="建行">建行</van-checkbox>
              <van-checkbox name="邮储">邮储</van-checkbox>
              <van-checkbox name="广发">广发</van-checkbox>
              <van-checkbox name="招行">招行</van-checkbox>
              <van-checkbox name="光大">光大</van-checkbox>
              <van-checkbox name="中信">中信</van-checkbox>
            </van-checkbox-group>

            <div v-for="org in module1Data.rejectedOrgs" :key="org" class="reject-reason">
              <van-field
                v-model="module1Data.rejectReasons[org]"
                :label="org + '被拒时间及原因'"
                placeholder="请输入被拒时间及原因"
                :rules="[{ required: true, message: '请填写被拒时间及原因' }]"
              />
            </div>
          </div>
        </div>
      </van-cell-group>

      <!-- 模块2：本人工作属性 -->
      <van-cell-group inset class="module-group">
        <van-cell title="本人工作属性" class="module-title">
          <template #icon>
            <van-icon name="work-o" class="module-icon" />
          </template>
        </van-cell>
        <div class="module-content">
          <!-- 01考察情况 -->
          <div class="section">
            <div class="section-title">01考察情况</div>
            
            <div class="form-item required">
              <div class="radio-title">工作类型：</div>
              <van-radio-group v-model="module2Data.workType" direction="horizontal" class="radio-group">
                <van-radio name="普通单位上班族">普通单位上班族</van-radio>
                <van-radio name="优质单位上班族">优质单位上班族</van-radio>
                <van-radio name="企业主">企业主</van-radio>
              </van-radio-group>
            </div>

            <div class="form-item required">
              <div class="radio-title">是否可考察：</div>
              <van-radio-group v-model="module2Data.canInvestigate" direction="horizontal" class="radio-group">
                <van-radio name="否">否</van-radio>
                <van-radio name="是">是</van-radio>
              </van-radio-group>

              <template v-if="module2Data.canInvestigate === '是'">
                <div class="checkbox-title">考察地点：</div>
                <van-checkbox-group 
                  v-model="module2Data.investigateLocations" 
                  direction="horizontal" 
                  class="checkbox-group"
                  :max="2"
                >
                  <van-checkbox name="家里">家里</van-checkbox>
                  <van-checkbox 
                    name="单位" 
                    :disabled="module2Data.workType === '企业主'"
                  >单位</van-checkbox>
                  <van-checkbox 
                    name="企业" 
                    :disabled="module2Data.workType !== '企业主'"
                  >企业</van-checkbox>
                </van-checkbox-group>
              </template>
            </div>
          </div>

          <!-- 02社保公积金个税情况 -->
          <div class="section">
            <div class="section-title">02社保公积金个税情况</div>
            
            <div class="form-item required">
              <div class="radio-title">是否有社保：</div>
              <van-radio-group v-model="module2Data.hasSocialSecurity" direction="horizontal" class="radio-group">
                <van-radio name="否">否</van-radio>
                <van-radio name="是">是</van-radio>
              </van-radio-group>

              <template v-if="module2Data.hasSocialSecurity === '是'">
                <div class="radio-title required">缴费主体：</div>
                <van-radio-group 
                  v-model="module2Data.socialSecurityPayer" 
                  direction="horizontal" 
                  class="radio-group"
                >
                  <van-radio name="个人">个人</van-radio>
                  <van-radio name="单位">单位</van-radio>
                </van-radio-group>

                <template v-if="module2Data.socialSecurityPayer === '个人'">
                  <div class="form-item">
                    <van-field
                      v-model="module2Data.socialSecurityArea"
                      label="社保地区"
                      placeholder="请选择社保地区"
                      readonly
                      is-link
                      @click="showSocialSecurityAreaPicker = true"
                    />
                  </div>

                  <div class="form-item">
                    <van-field
                      v-model="module2Data.socialSecurityTotalMonths"
                      label="连续缴社保合计"
                      type="number"
                      placeholder="请输入月数"
                    >
                      <template #right-icon>个月</template>
                    </van-field>
                    <van-field
                      v-model="module2Data.socialSecurityCurrentMonths"
                      label="当前单位"
                      type="number"
                      placeholder="请输入月数"
                    >
                      <template #right-icon>个月</template>
                    </van-field>
                  </div>

                  <div class="form-item">
                    <van-field
                      v-model="module2Data.medicalBase"
                      label="近半年平均医疗基数"
                      type="number"
                      placeholder="请输入金额"
                    >
                      <template #right-icon>元</template>
                    </van-field>
                    <van-field
                      v-model="module2Data.pensionBase"
                      label="近半年平均养老基数"
                      type="number"
                      placeholder="请输入金额"
                    >
                      <template #right-icon>元</template>
                    </van-field>
                  </div>

                  <div class="form-item">
                    <van-field
                      v-model="module2Data.socialSecurityNote"
                      label="社保补充"
                      type="textarea"
                      placeholder="断缴补缴等情况"
                      rows="2"
                    />
                  </div>
                </template>

                <template v-if="module2Data.socialSecurityPayer === '单位'">
                  <div class="form-item">
                    <van-field
                      v-model="module2Data.socialSecurityCompany"
                      label="社保单位全称"
                      placeholder="请输入单位全称"
                    />
                  </div>

                  <div class="form-item">
                    <van-field
                      v-model="module2Data.socialSecurityArea"
                      label="社保地区"
                      placeholder="请选择社保地区"
                      readonly
                      is-link
                      @click="showSocialSecurityAreaPicker = true"
                    />
                  </div>

                  <div class="form-item">
                    <van-field
                      v-model="module2Data.socialSecurityTotalMonths"
                      label="连续缴社保合计"
                      type="number"
                      placeholder="请输入月数"
                    >
                      <template #right-icon>个月</template>
                    </van-field>
                    <van-field
                      v-model="module2Data.socialSecurityCurrentMonths"
                      label="当前单位"
                      type="number"
                      placeholder="请输入月数"
                    >
                      <template #right-icon>个月</template>
                    </van-field>
                  </div>

                  <div class="form-item">
                    <van-field
                      v-model="module2Data.medicalBase"
                      label="近半年平均医疗基数"
                      type="number"
                      placeholder="请输入金额"
                    >
                      <template #right-icon>元</template>
                    </van-field>
                    <van-field
                      v-model="module2Data.pensionBase"
                      label="近半年平均养老基数"
                      type="number"
                      placeholder="请输入金额"
                    >
                      <template #right-icon>元</template>
                    </van-field>
                  </div>

                  <div class="form-item">
                    <van-field
                      v-model="module2Data.socialSecurityNote"
                      label="社保补充"
                      type="textarea"
                      placeholder="是否敏感行业 (律师|公检法|租车等) 或 断缴补缴等情况"
                      rows="2"
                    />
                  </div>
                </template>

                <!-- 公积金情况 - 只在社保选择单位且填写了单位全称后显示 -->
                <template v-if="module2Data.socialSecurityPayer === '单位' && module2Data.socialSecurityCompany">
                  <div class="form-item">
                    <div class="radio-title">是否有公积金：</div>
                    <van-radio-group v-model="module2Data.hasProvidentFund" direction="horizontal" class="radio-group">
                      <van-radio name="否">否</van-radio>
                      <van-radio name="是">是</van-radio>
                    </van-radio-group>
                  </div>
                  <template v-if="module2Data.hasProvidentFund === '是'">
                    <div class="form-item">
                      <div class="radio-title">公积金单位名称：</div>
                      <van-radio-group v-model="module2Data.providentFundCompanyType" direction="horizontal" class="radio-group">
                        <van-radio name="同社保单位">同社保单位</van-radio>
                        <van-radio name="不同于社保单位">不同于社保单位</van-radio>
                      </van-radio-group>
                    </div>
                    <div class="form-item" v-if="module2Data.providentFundCompanyType === '不同于社保单位'">
                      <van-field
                        v-model="module2Data.providentFundCompanyName"
                        label="公积金单位名称"
                        placeholder="请输入单位名称"
                      />
                    </div>
                    <div class="form-item">
                      <van-field
                        v-model="module2Data.providentFundArea"
                        label="公积金地区"
                        placeholder="请选择公积金地区"
                        readonly
                        is-link
                        :disabled="module2Data.providentFundCompanyType === '同社保单位'"
                        @click="handleProvidentFundAreaClick"
                      />
                    </div>
                    <div class="form-item">
                      <van-field
                        v-model="module2Data.providentFundTotalMonths"
                        label="连续缴公积金合计"
                        type="digit"
                        placeholder="请输入月数"
                        :rules="[{ pattern: /^\d+(\.\d)?$/, message: '请输入数字' }]"
                      >
                        <template #right-icon>个月</template>
                      </van-field>
                      <van-field
                        v-model="module2Data.providentFundCurrentMonths"
                        label="当前单位"
                        type="number"
                        placeholder="请输入月数"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                      >
                        <template #right-icon>个月</template>
                      </van-field>
                    </div>
                    <div class="form-item">
                      <van-field
                        v-model="module2Data.providentFundBase"
                        label="近半年平均公积金基数"
                        type="number"
                        placeholder="请输入金额"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                      >
                        <template #right-icon>元</template>
                      </van-field>
                    </div>
                    <div class="form-item">
                      <van-field
                        v-model="module2Data.providentFundNote"
                        label="公积金补充"
                        type="textarea"
                        placeholder="是否断缴、补缴等情况"
                        rows="2"
                      />
                    </div>
                  </template>
                </template>

                <!-- 个税情况 - 只在社保选择单位且填写了单位全称后显示 -->
                <template v-if="module2Data.socialSecurityPayer === '单位' && module2Data.socialSecurityCompany">
                  <div class="form-item">
                    <div class="radio-title">是否有个税：</div>
                    <van-radio-group v-model="module2Data.hasTax" direction="horizontal" class="radio-group">
                      <van-radio name="否">否</van-radio>
                      <van-radio name="是">是</van-radio>
                    </van-radio-group>
                  </div>
                  <template v-if="module2Data.hasTax === '是'">
                    <div class="form-item">
                      <div class="radio-title">个税单位名称：</div>
                      <van-radio-group v-model="module2Data.taxCompanyType" direction="horizontal" class="radio-group">
                        <van-radio name="同社保单位">同社保单位</van-radio>
                        <van-radio name="不同于社保单位">不同于社保单位</van-radio>
                      </van-radio-group>
                    </div>
                    <div class="form-item" v-if="module2Data.taxCompanyType === '不同于社保单位'">
                      <van-field
                        v-model="module2Data.taxCompanyName"
                        label="个税单位名称"
                        placeholder="请输入单位名称"
                      />
                    </div>
                    <div class="form-item">
                      <van-field
                        v-model="module2Data.taxArea"
                        label="个税地区"
                        placeholder="请选择个税地区"
                        readonly
                        is-link
                        :disabled="module2Data.taxCompanyType === '同社保单位'"
                        @click="handleTaxAreaClick"
                      />
                    </div>
                    <div class="form-item">
                      <van-field
                        v-model="module2Data.taxTotalMonths"
                        label="连续缴个税合计"
                        type="number"
                        placeholder="请输入月数"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                      >
                        <template #right-icon>个月</template>
                      </van-field>
                      <van-field
                        v-model="module2Data.taxCurrentMonths"
                        label="当前单位"
                        type="number"
                        placeholder="请输入月数"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                      >
                        <template #right-icon>个月</template>
                      </van-field>
                    </div>
                    <div class="form-item">
                      <van-field
                        v-model="module2Data.taxBase"
                        label="近半年平均个税税前工资"
                        type="number"
                        placeholder="请输入金额"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                      >
                        <template #right-icon>元</template>
                      </van-field>
                    </div>
                    <div class="form-item">
                      <van-field
                        v-model="module2Data.taxNote"
                        label="个税补充"
                        type="textarea"
                        placeholder="是否断缴、补缴等情况"
                        rows="2"
                      />
                    </div>
                  </template>
                </template>
              </template>
            </div>
          </div>

          <!-- 03企业信息，仅企业主显示 -->
          <div class="section" v-if="module2Data.workType === '企业主'">
            <div class="section-title">03企业信息</div>
            <div class="form-item">
              <van-field
                v-model="module2Data.companyName"
                label="企业名称"
                placeholder="请输入企业名称"
              />
            </div>
            <div class="form-item">
              <van-field
                v-model="module2Data.companyAge"
                label="企业成立年限"
                type="number"
                placeholder="请输入年数"
              >
                <template #right-icon>年</template>
              </van-field>
            </div>
            <div class="form-item">
              <van-field
                v-model="module2Data.companyIncome"
                label="企业年流水"
                type="number"
                placeholder="请输入金额"
              >
                <template #right-icon>万元</template>
              </van-field>
            </div>
            <div class="form-item">
              <van-field
                v-model="module2Data.companyStaff"
                label="企业员工人数"
                type="number"
                placeholder="请输入人数"
              >
                <template #right-icon>人</template>
              </van-field>
            </div>
            <div class="form-item">
              <van-field
                v-model="module2Data.companyNote"
                label="企业补充说明"
                type="textarea"
                placeholder="如有特殊情况请补充"
                rows="2"
              />
            </div>
          </div>
        </div>
      </van-cell-group>

      <!-- 模块3：本人加分选项 -->
      <van-cell-group inset class="module-group">
        <van-cell title="本人加分选项" class="module-title">
          <template #icon>
            <van-icon name="plus" class="module-icon" />
          </template>
        </van-cell>
        <div class="module-content">
          <!-- 01学历情况 -->
          <div class="section">
            <div class="section-title">01学历情况</div>
            <div class="form-item">
              <div class="radio-title">学历 <span style="color: #f56c6c">*</span></div>
              <van-radio-group v-model="module3Data.education" direction="horizontal" class="radio-group">
                <van-radio name="从未上过学">从未上过学</van-radio>
                <van-radio name="小学">小学</van-radio>
                <van-radio name="初中">初中</van-radio>
                <van-radio name="高中">高中</van-radio>
                <van-radio name="大专">大专</van-radio>
                <van-radio name="本科">本科</van-radio>
                <van-radio name="硕士">硕士</van-radio>
                <van-radio name="博士">博士</van-radio>
              </van-radio-group>
            </div>
            <!-- 选择大专及以上学历才显示 -->
            <template v-if="['大专','本科','硕士','博士'].includes(module3Data.education)">
              <div class="form-item">
                <div class="radio-title">是否学信网可查</div>
                <van-radio-group v-model="module3Data.educationCheck" direction="horizontal" class="radio-group">
                  <van-radio name="不可查">不可查</van-radio>
                  <van-radio name="可查">可查</van-radio>
                </van-radio-group>
              </div>
              <!-- 选择可查才显示全日制 -->
              <template v-if="module3Data.educationCheck === '可查'">
                <div class="form-item">
                  <div class="radio-title">是否全日制</div>
                  <van-radio-group v-model="module3Data.educationFullTime" direction="horizontal" class="radio-group">
                    <van-radio name="否">否</van-radio>
                    <van-radio name="是">是</van-radio>
                  </van-radio-group>
                </div>
              </template>
            </template>
          </div>

          <!-- 02房产情况 -->
          <div class="section">
            <div class="section-title">02房产情况</div>
            <div class="form-item">
              <div class="radio-title">是否有房产</div>
              <van-radio-group v-model="module3Data.hasHouse" direction="horizontal" class="radio-group">
                <van-radio name="否">否</van-radio>
                <van-radio name="是">是</van-radio>
              </van-radio-group>
            </div>
            <template v-if="module3Data.hasHouse === '是'">
              <div class="form-item">
                <van-field
                  v-model="module3Data.houseCount"
                  label="合计"
                  type="digit"
                  placeholder="请输入房产套数"
                  :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                >
                  <template #right-icon>套</template>
                </van-field>
              </div>
              <template v-for="(house, idx) in module3Data.houses" :key="idx">
                <div class="house-block">
                  <div class="section-title">第{{ idx + 1 }}套房产信息</div>
                  <div class="form-item">
                    <van-field
                      v-model="house.area"
                      label="房产地区"
                      is-link
                      readonly
                      placeholder="请选择房产地区"
                      @click="handleHouseAreaClick(idx)"
                    />
                  </div>
                  <div class="form-item">
                    <div class="radio-title">房产性质</div>
                    <van-radio-group v-model="house.type" direction="horizontal" class="radio-group">
                      <van-radio name="商品房·住宅">商品房·住宅</van-radio>
                      <van-radio name="商品房·商业">商品房·商业</van-radio>
                      <van-radio name="非商品房">非商品房</van-radio>
                    </van-radio-group>
                  </div>
                  <template v-if="house.type">
                    <div class="form-item">
                      <van-field
                        v-model="house.ownMonths"
                        label="名下"
                        type="number"
                        placeholder="请输入月数"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                      >
                        <template #right-icon>个月</template>
                      </van-field>
                      <van-field
                        v-model="house.size"
                        label="面积"
                        type="number"
                        placeholder="请输入面积"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                      >
                        <template #right-icon>㎡</template>
                      </van-field>
                    </div>
                    <div class="form-item">
                      <div class="radio-title">共有情况</div>
                      <van-radio-group v-model="house.shareType" direction="horizontal" class="radio-group">
                        <van-radio name="单独所有">单独所有</van-radio>
                        <van-radio name="共同共有">共同共有</van-radio>
                      </van-radio-group>
                    </div>
                    <template v-if="house.shareType === '共同共有'">
                      <div class="form-item">
                        <van-field
                          v-model="house.sharePercent"
                          label="占比份额"
                          type="number"
                          placeholder="请输入占比%"
                          :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        >
                          <template #right-icon>%</template>
                        </van-field>
                        <van-field
                          v-model="house.shareWith"
                          label="与谁联名"
                          is-link
                          readonly
                          placeholder="请选择联名人"
                          @click="handleHouseShareWithClick(idx)"
                        />
                      </div>
                    </template>
                    <div class="form-item">
                      <van-field
                        v-model="house.evalPrice"
                        label="评估"
                        type="digit"
                        placeholder="请输入评估价"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                      >
                        <template #right-icon>万</template>
                      </van-field>
                      <div class="radio-title">状态</div>
                      <van-radio-group v-model="house.status" direction="horizontal" class="radio-group">
                        <van-radio name="全款">全款</van-radio>
                        <van-radio name="按揭">按揭</van-radio>
                        <van-radio name="抵押">抵押</van-radio>
                      </van-radio-group>
                    </div>
                    <!-- 按揭扩展 -->
                    <template v-if="house.status === '按揭'">
                      <div class="form-item">
                        <van-field
                          v-model="house.mortgageAmount"
                          label="按揭金额"
                          type="number"
                          placeholder="请输入金额"
                          :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        >
                          <template #right-icon>万</template>
                        </van-field>
                        <van-field
                          v-model="house.mortgageOrg"
                          label="按揭机构名称"
                          placeholder="请输入机构名称"
                        />
                        <van-field
                          v-model="house.mortgageMonths"
                          label="供"
                          type="number"
                          placeholder="请输入月数"
                          :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        >
                          <template #right-icon>个月</template>
                        </van-field>
                      </div>
                      <div class="form-item">
                        <div class="radio-title">是否有二押</div>
                        <van-radio-group v-model="house.mortgageSecond" direction="horizontal" class="radio-group">
                          <van-radio name="否">否</van-radio>
                          <van-radio name="是">是</van-radio>
                        </van-radio-group>
                      </div>
                      <template v-if="house.mortgageSecond === '是'">
                        <div class="form-item">
                          <van-field
                            v-model="house.mortgageSecondAmount"
                            label="二押金额"
                            type="number"
                            placeholder="请输入金额"
                            :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                          >
                            <template #right-icon>万</template>
                          </van-field>
                          <van-field
                            v-model="house.mortgageSecondType"
                            label="机构类型"
                            is-link
                            readonly
                            placeholder="请选择机构类型"
                            @click="showHouseSecondTypePicker(house)"
                          />
                          <van-field
                            v-model="house.mortgageSecondOrg"
                            label="机构名称"
                            placeholder="请输入机构名称"
                          />
                        </div>
                      </template>
                    </template>
                    <!-- 抵押扩展 -->
                    <template v-if="house.status === '抵押'">
                      <div class="form-item">
                        <van-field
                          v-model="house.pledgeAmount"
                          label="抵押金额"
                          type="number"
                          placeholder="请输入金额"
                          :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        >
                          <template #right-icon>万</template>
                        </van-field>
                        <van-field
                          v-model="house.pledgeOrg"
                          label="抵押机构名称"
                          placeholder="请输入机构名称"
                        />
                        <van-field
                          v-model="house.pledgeMonths"
                          label="供"
                          type="number"
                          placeholder="请输入月数"
                          :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        >
                          <template #right-icon>个月</template>
                        </van-field>
                      </div>
                      <div class="form-item">
                        <div class="radio-title">是否有二押</div>
                        <van-radio-group v-model="house.pledgeSecond" direction="horizontal" class="radio-group">
                          <van-radio name="否">否</van-radio>
                          <van-radio name="是">是</van-radio>
                        </van-radio-group>
                      </div>
                      <template v-if="house.pledgeSecond === '是'">
                        <div class="form-item">
                          <van-field
                            v-model="house.pledgeSecondAmount"
                            label="二押金额"
                            type="number"
                            placeholder="请输入金额"
                            :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                          >
                            <template #right-icon>万</template>
                          </van-field>
                          <van-field
                            v-model="house.pledgeSecondType"
                            label="机构类型"
                            is-link
                            readonly
                            placeholder="请选择机构类型"
                            @click="house.pledgeSecondTypePickerShow = true"
                          />
                          <van-popup v-model:show="house.pledgeSecondTypePickerShow" position="bottom">
                            <van-picker
                              :columns="houseSecondTypeOptions"
                              @confirm="val => { house.pledgeSecondType = val.selectedOptions[0].text; house.pledgeSecondTypePickerShow = false }"
                              @cancel="house.pledgeSecondTypePickerShow = false"
                              show-toolbar
                              title="选择机构类型"
                            />
                          </van-popup>
                          <van-field
                            v-model="house.pledgeSecondOrg"
                            label="机构名称"
                            placeholder="请输入机构名称"
                          />
                        </div>
                      </template>
                    </template>
                  </template>
                </div>
              </template>
            </template>
          </div>

          <!-- 03车产情况 -->
          <div class="section">
            <div class="section-title">03车产情况</div>
            <div class="form-item">
              <div class="radio-title">是否有车产</div>
              <van-radio-group v-model="module3CarData.hasCar" direction="horizontal" class="radio-group">
                <van-radio name="否">否</van-radio>
                <van-radio name="是">是</van-radio>
              </van-radio-group>
            </div>
            <template v-if="module3CarData.hasCar === '是'">
              <div class="form-item">
                <div class="radio-title">车辆类型</div>
                <van-radio-group v-model="module3CarData.carType" direction="horizontal" class="radio-group">
                  <van-radio name="一手车">一手车</van-radio>
                  <van-radio name="二手车">二手车</van-radio>
                </van-radio-group>
              </div>
              <!-- 一手车扩展 -->
              <template v-if="module3CarData.carType === '一手车'">
                <div class="form-item">
                  <van-field
                    v-model="module3CarData.carPlateArea"
                    label="车牌地区"
                    is-link
                    readonly
                    placeholder="请选择车牌地区"
                    @click="handleCarPlateAreaClick"
                  />
                </div>
                <div class="form-item">
                  <van-field
                    v-model="module3CarData.carOwnMonths"
                    label="名下"
                    type="digit"
                    placeholder="请输入月数"
                    :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                  >
                    <template #right-icon>个月</template>
                  </van-field>
                  <van-field
                    v-model="module3CarData.carPlate"
                    label="车牌"
                    placeholder="请输入车牌"
                  />
                  <van-field
                    v-model="module3CarData.carInvoice"
                    label="发票"
                    type="digit"
                    placeholder="请输入金额"
                    :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                  >
                    <template #right-icon>万</template>
                  </van-field>
                </div>
              </template>
              <!-- 二手车扩展 -->
              <template v-if="module3CarData.carType === '二手车'">
                <div class="form-item">
                  <van-field
                    v-model="module3CarData.carPlateArea"
                    label="车牌地区"
                    is-link
                    readonly
                    placeholder="请选择车牌地区"
                    @click="handleCarPlateAreaClick"
                  />
                </div>
                <div class="form-item">
                  <van-field
                    v-model="module3CarData.carOwnMonths"
                    label="名下"
                    type="digit"
                    placeholder="请输入月数"
                    :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                  >
                    <template #right-icon>个月</template>
                  </van-field>
                  <van-field
                    v-model="module3CarData.carPlate"
                    label="车牌"
                    placeholder="请输入车牌"
                  />
                  <van-field
                    v-model="module3CarData.carEval"
                    label="评估"
                    type="digit"
                    placeholder="请输入金额"
                    :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                  >
                    <template #right-icon>万</template>
                  </van-field>
                  <van-field
                    v-model="module3CarData.carMileage"
                    label="公里数"
                    type="digit"
                    placeholder="请输入公里数"
                    :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                  >
                    <template #right-icon>KM</template>
                  </van-field>
                </div>
              </template>
              <!-- 车产状态 -->
              <div class="form-item">
                <div class="radio-title">车产状态</div>
                <van-radio-group v-model="module3CarData.carStatus" direction="horizontal" class="radio-group">
                  <van-radio name="全款">全款</van-radio>
                  <van-radio name="按揭">按揭</van-radio>
                  <van-radio name="抵押">抵押</van-radio>
                </van-radio-group>
              </div>
              <!-- 按揭扩展 -->
              <template v-if="module3CarData.carStatus === '按揭'">
                <div class="form-item">
                  <van-field
                    v-model="module3CarData.carMortgageAmount"
                    label="按揭金额"
                    type="digit"
                    placeholder="请输入金额"
                    :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                  >
                    <template #right-icon>万</template>
                  </van-field>
                  <van-field
                    v-model="module3CarData.carMortgageMonths"
                    label="月供"
                    type="digit"
                    placeholder="请输入月数"
                    :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                  >
                    <template #right-icon>个月</template>
                  </van-field>
                  <van-field
                    v-model="module3CarData.carMortgageOrg"
                    label="按揭机构"
                    placeholder="请输入机构名称"
                  />
                </div>
              </template>
              <!-- 抵押扩展 -->
              <template v-if="module3CarData.carStatus === '抵押'">
                <div class="form-item">
                  <van-field
                    v-model="module3CarData.carPledgeAmount"
                    label="抵押金额"
                    type="digit"
                    placeholder="请输入金额"
                    :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                  >
                    <template #right-icon>万</template>
                  </van-field>
                  <van-field
                    v-model="module3CarData.carPledgeMonths"
                    label="月供"
                    type="digit"
                    placeholder="请输入月数"
                    :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                  >
                    <template #right-icon>个月</template>
                  </van-field>
                  <van-field
                    v-model="module3CarData.carPledgeOrg"
                    label="抵押机构"
                    placeholder="请输入机构名称"
                  />
                </div>
              </template>
            </template>
          </div>

          <!-- 04金融资产情况 -->
          <div class="section">
            <div class="section-title">04金融资产情况</div>
            <div class="form-item">
              <div class="radio-title">是否有金融资产（限填4份）</div>
              <van-radio-group v-model="module3AssetData.hasAsset" direction="horizontal" class="radio-group">
                <van-radio name="否">否</van-radio>
                <van-radio name="是">是</van-radio>
              </van-radio-group>
            </div>
            <template v-if="module3AssetData.hasAsset === '是'">
              <div class="form-item">
                <van-field
                  v-model="module3AssetData.assetCount"
                  label="合计"
                  type="digit"
                  placeholder="请输入金融资产份数（最多4份）"
                  :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                  maxlength="1"
                >
                  <template #right-icon>份</template>
                </van-field>
              </div>
              <template v-for="(asset, idx) in module3AssetData.assets" :key="idx">
                <div class="asset-block">
                  <div class="section-title">第{{ idx + 1 }}份金融资产</div>
                  <div class="form-item">
                    <van-field
                      v-model="asset.type"
                      label="类型"
                      is-link
                      readonly
                      placeholder="请选择类型"
                      @click="handleAssetTypeClick(idx)"
                    />
                  </div>
                  <div class="form-item">
                    <van-field
                      v-model="asset.months"
                      label="持有"
                      type="digit"
                      placeholder="请输入月数"
                      :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                    >
                      <template #right-icon>个月</template>
                    </van-field>
                    <van-field
                      v-model="asset.amount"
                      label="当前"
                      type="digit"
                      placeholder="请输入金额"
                      :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                    >
                      <template #right-icon>万</template>
                    </van-field>
                  </div>
                </div>
              </template>
            </template>
          </div>

          <!-- 05流水情况 -->
          <div class="section">
            <div class="section-title">05流水情况</div>
            <div class="form-item">
              <div class="radio-title">是否有有效流水（限填2份）</div>
              <van-radio-group v-model="module3FlowData.hasFlow" direction="horizontal" class="radio-group">
                <van-radio name="否">否</van-radio>
                <van-radio name="是">是</van-radio>
              </van-radio-group>
            </div>

            <template v-if="module3FlowData.hasFlow === '是'">
              <div class="form-item">
                <van-field
                  v-model="module3FlowData.flowCount"
                  label="合计"
                  type="digit"
                  placeholder="请输入流水份数（最多2份）"
                  :rules="[{ pattern: /^\d+$/, message: '请输入整数' }]"
                  maxlength="1"
                >
                  <template #right-icon>份</template>
                </van-field>
              </div>

              <template v-for="(flow, idx) in module3FlowData.flows" :key="idx">
                <div class="flow-block">
                  <div class="section-title">第{{ idx + 1 }}份流水</div>
                  
                  <div class="form-item">
                    <div class="radio-title">流水类别</div>
                    <van-radio-group v-model="flow.type" direction="horizontal" class="radio-group">
                      <van-radio name="个人微信">个人微信</van-radio>
                      <van-radio name="个人支付宝">个人支付宝</van-radio>
                      <van-radio name="对公">对公</van-radio>
                      <van-radio name="个人银行卡">个人银行卡</van-radio>
                    </van-radio-group>
                  </div>

                  <!-- 对公流水特点 -->
                  <template v-if="flow.type === '对公'">
                    <div class="form-item">
                      <div class="checkbox-title">流水特点描述：</div>
                      <van-checkbox-group v-model="flow.features" direction="horizontal" class="checkbox-group">
                        <van-checkbox name="进账大">进账大</van-checkbox>
                        <van-checkbox name="结息大">结息大</van-checkbox>
                        <van-checkbox name="扣税记录">扣税记录</van-checkbox>
                        <van-checkbox name="代发工资记录">代发工资记录</van-checkbox>
                      </van-checkbox-group>
                    </div>
                    <div class="form-item">
                      <van-field
                        v-model="flow.avgIncome6Months"
                        label="近6个月月均进账"
                        type="number"
                        placeholder="请输入金额"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        @blur="formatAvgIncome(flow, 'avgIncome6Months')"
                      >
                        <template #right-icon>万</template>
                      </van-field>
                      <van-field
                        v-model="flow.avgIncome12Months"
                        label="近12个月月均进账"
                        type="number"
                        placeholder="请输入金额"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        @blur="formatAvgIncome(flow, 'avgIncome12Months')"
                      >
                        <template #right-icon>万</template>
                      </van-field>
                    </div>
                    <div class="form-item">
                      <div class="interest-title">近一年结息</div>
                      <div class="interest-inputs">
                        <van-field
                          v-for="(_, i) in flow.interest"
                          :key="i"
                          v-model="flow.interest[i]"
                          type="number"
                          placeholder="请输入金额"
                          :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                          @blur="formatInterest(flow, i)"
                        >
                          <template #right-icon>元</template>
                        </van-field>
                      </div>
                    </div>
                  </template>

                  <!-- 个人微信/支付宝流水特点 -->
                  <template v-if="['个人微信', '个人支付宝'].includes(flow.type)">
                    <div class="form-item">
                      <div class="checkbox-title">流水特点描述：</div>
                      <van-checkbox-group v-model="flow.features" direction="horizontal" class="checkbox-group">
                        <van-checkbox name="进账大">进账大</van-checkbox>
                        <van-checkbox name="消费记录">消费记录</van-checkbox>
                      </van-checkbox-group>
                    </div>
                    <div class="form-item">
                      <van-field
                        v-model="flow.avgIncome6Months"
                        label="近6个月月均进账"
                        type="number"
                        placeholder="请输入金额"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        @blur="formatAvgIncome(flow, 'avgIncome6Months')"
                      >
                        <template #right-icon>万</template>
                      </van-field>
                      <van-field
                        v-model="flow.avgIncome12Months"
                        label="近12个月月均进账"
                        type="number"
                        placeholder="请输入金额"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        @blur="formatAvgIncome(flow, 'avgIncome12Months')"
                      >
                        <template #right-icon>万</template>
                      </van-field>
                    </div>
                  </template>

                  <!-- 个人银行卡流水特点 -->
                  <template v-if="flow.type === '个人银行卡'">
                    <div class="form-item">
                      <div class="checkbox-title">流水特点描述：</div>
                      <van-checkbox-group v-model="flow.features" direction="horizontal" class="checkbox-group">
                        <van-checkbox name="进账大">进账大</van-checkbox>
                        <van-checkbox name="结息大">结息大</van-checkbox>
                        <van-checkbox name="代发工资">代发工资</van-checkbox>
                        <van-checkbox name="固定转账">固定转账</van-checkbox>
                        <van-checkbox name="分红">分红</van-checkbox>
                      </van-checkbox-group>
                    </div>
                    <div class="form-item" v-if="flow.features.includes('代发工资')">
                      <van-field
                        v-model="flow.salaryAmount"
                        label="代发工资金额"
                        type="number"
                        placeholder="请输入金额"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        @blur="formatSalaryAmount(flow)"
                      >
                        <template #right-icon>万</template>
                      </van-field>
                    </div>
                    <div class="form-item">
                      <van-field
                        v-model="flow.avgIncome6Months"
                        label="近6个月月均进账"
                        type="number"
                        placeholder="请输入金额"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        @blur="formatAvgIncome(flow, 'avgIncome6Months')"
                      >
                        <template #right-icon>万</template>
                      </van-field>
                      <van-field
                        v-model="flow.avgIncome12Months"
                        label="近12个月月均进账"
                        type="number"
                        placeholder="请输入金额"
                        :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                        @blur="formatAvgIncome(flow, 'avgIncome12Months')"
                      >
                        <template #right-icon>万</template>
                      </van-field>
                    </div>
                    <div class="form-item">
                      <div class="interest-title">近一年结息</div>
                      <div class="interest-inputs">
                        <van-field
                          v-for="(_, i) in flow.interest"
                          :key="i"
                          v-model="flow.interest[i]"
                          type="number"
                          placeholder="请输入金额"
                          :rules="[{ pattern: /^\d+(\.\d+)?$/, message: '请输入数字' }]"
                          @blur="formatInterest(flow, i)"
                        >
                          <template #right-icon>元</template>
                        </van-field>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </template>
          </div>
        </div>
      </van-cell-group>

      <!-- 模块4：本人特殊情况补充 -->
      <van-cell-group inset class="module-group">
        <van-cell title="本人特殊情况补充" class="module-title">
          <template #icon>
            <van-icon name="info-o" class="module-icon" />
          </template>
        </van-cell>
        <div class="module-content">
          <!-- 01普通话/粤语 -->
          <div class="section">
            <div class="section-title">01普通话/粤语</div>
            <div class="form-item">
              <div class="radio-title">语言能力 <span style="color: #f56c6c">*</span></div>
              <van-radio-group 
                v-model="module4Data.language" 
                direction="horizontal" 
                class="radio-group"
                :rules="[{ required: true, message: '请选择语言能力' }]"
              >
                <van-radio name="普通话和粤语都会">普通话和粤语都会</van-radio>
                <van-radio name="只会普通话">只会普通话</van-radio>
                <van-radio name="只会粤语">只会粤语</van-radio>
                <van-radio name="普通话和粤语都不会">普通话和粤语都不会</van-radio>
              </van-radio-group>
            </div>
          </div>

          <!-- 02写字能力 -->
          <div class="section">
            <div class="section-title">02写字能力</div>
            <div class="form-item">
              <div class="radio-title">写字能力 <span style="color: #f56c6c">*</span></div>
              <van-radio-group 
                v-model="module4Data.writing" 
                direction="horizontal" 
                class="radio-group"
                :rules="[{ required: true, message: '请选择写字能力' }]"
              >
                <van-radio name="写字正常">写字正常</van-radio>
                <van-radio name="写字很慢">写字很慢</van-radio>
                <van-radio name="不会写字">不会写字</van-radio>
              </van-radio-group>
            </div>
          </div>

          <!-- 03身体缺陷 -->
          <div class="section">
            <div class="section-title">03身体缺陷</div>
            <div class="form-item">
              <div class="radio-title">身体状况 <span style="color: #f56c6c">*</span></div>
              <van-radio-group 
                v-model="module4Data.physical" 
                direction="horizontal" 
                class="radio-group"
                :rules="[{ required: true, message: '请选择身体状况' }]"
              >
                <van-radio name="身体正常">身体正常</van-radio>
                <van-radio name="身体有明显残疾">身体有明显残疾</van-radio>
              </van-radio-group>
            </div>
          </div>
        </div>
      </van-cell-group>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <van-button type="primary" block class="submit-btn" @click="submitAll">
          提交全部信息
        </van-button>
      </div>
    </div>

    <!-- 将选择器弹出层移到最外层 -->
    <van-popup v-model:show="showHouseSecondTypePickerVisible" position="bottom">
      <van-picker
        :columns="houseSecondTypeOptions"
        @confirm="onHouseSecondTypeConfirm"
        @cancel="showHouseSecondTypePickerVisible = false"
        show-toolbar
        title="选择机构类型"
      />
    </van-popup>
    
    <van-popup v-model:show="showSocialSecurityAreaPicker" position="bottom">
      <van-picker
        :columns="areaOptions"
        @confirm="onSocialSecurityAreaConfirm"
        @cancel="showSocialSecurityAreaPicker = false"
        show-toolbar
        title="选择社保地区"
      />
    </van-popup>

    <!-- 公积金地区选择器弹窗 -->
    <van-popup v-model:show="showProvidentFundAreaPicker" position="bottom">
      <van-picker
        :columns="providentFundAreaOptions"
        @confirm="onProvidentFundAreaConfirm"
        @cancel="showProvidentFundAreaPicker = false"
        show-toolbar
        title="选择公积金地区"
      />
    </van-popup>

    <!-- 个税地区选择器弹窗 -->
    <van-popup v-model:show="showTaxAreaPicker" position="bottom">
      <van-picker
        :columns="taxAreaOptions"
        @confirm="onTaxAreaConfirm"
        @cancel="showTaxAreaPicker = false"
        show-toolbar
        title="选择个税地区"
      />
    </van-popup>

    <!-- 房产地区选择器弹窗 -->
    <van-popup v-model:show="showHouseAreaPicker" position="bottom">
      <van-picker
        :columns="houseAreaOptions"
        @confirm="onHouseAreaConfirm"
        @cancel="showHouseAreaPicker = false"
        show-toolbar
        title="选择房产地区"
      />
    </van-popup>

    <!-- 房产共有人选择器弹窗 -->
    <van-popup v-model:show="showHouseShareWithPicker" position="bottom">
      <van-picker
        :columns="houseShareWithColumns"
        @confirm="onHouseShareWithConfirm"
        @cancel="showHouseShareWithPicker = false"
        show-toolbar
        title="选择联名人"
      />
    </van-popup>
    <!-- 车牌地区选择器弹窗放最外层 -->
    <van-popup v-model:show="showCarPlateAreaPicker" position="bottom">
      <van-picker
        :columns="carPlateAreaOptions"
        @confirm="onCarPlateAreaConfirm"
        @cancel="showCarPlateAreaPicker = false"
        show-toolbar
        title="选择车牌地区"
      />
    </van-popup>

    <!-- 公积金地区选择器弹窗 -->
    <van-popup v-model:show="showProvidentFundAreaPicker" position="bottom">
      <van-picker
        :columns="providentFundAreaOptions"
        @confirm="onProvidentFundAreaConfirm"
        @cancel="showProvidentFundAreaPicker = false"
        show-toolbar
        title="选择公积金地区"
      />
    </van-popup>

    <!-- 个税地区选择器弹窗 -->
    <van-popup v-model:show="showTaxAreaPicker" position="bottom">
      <van-picker
        :columns="taxAreaOptions"
        @confirm="onTaxAreaConfirm"
        @cancel="showTaxAreaPicker = false"
        show-toolbar
        title="选择个税地区"
      />
    </van-popup>

    <!-- 金融资产类型选择器弹窗放最外层 -->
    <van-popup v-model:show="showAssetTypePicker" position="bottom">
      <van-picker
        :columns="assetTypeOptions"
        @confirm="onAssetTypeConfirm"
        @cancel="showAssetTypePicker = false"
        show-toolbar
        title="选择金融资产类型"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模块1的数据
const module1Data = reactive({
  // 近半年查询记录
  queryRecords: [
    {
      date: '2025-04-01',
      org: '机构A-信用卡审批',
      loanType: '装修贷',
      progress: '已批-已放款',
      rejectReason: ''
    },
    {
      date: '2025-04-28',
      org: '机构B-信用卡审批',
      loanType: '车贷',
      progress: '已拒',
      rejectReason: ''
    }
  ],
  // 近五年未结清
  unpaidLoans: [
    {
      date: '2023-01-01',
      org: '机构A',
      amount: '30万',
      progress: '已还6N',
      loanType: ''
    }
  ],
  // 黑灰名单机构
  blacklistOrgs: [],
  blacklistReasons: {},
  // 被拒记录机构
  rejectedOrgs: [],
  rejectReasons: {}
})

// 模块2的数据
const module2Data = reactive({
  // 考察情况
  workType: '',
  canInvestigate: '',
  investigateLocations: [] as string[],
  
  // 社保情况
  hasSocialSecurity: '',
  socialSecurityPayer: '',
  socialSecurityArea: '',
  socialSecurityCompany: '',
  socialSecurityTotalMonths: '',
  socialSecurityCurrentMonths: '',
  medicalBase: '',
  pensionBase: '',
  socialSecurityNote: '',
  
  // 公积金情况
  hasProvidentFund: '',
  providentFundArea: '',
  providentFundCompany: '',
  providentFundTotalMonths: '',
  providentFundCurrentMonths: '',
  providentFundBase: '',
  providentFundNote: '',
  providentFundCompanyType: '',
  providentFundCompanyName: '',
  
  // 个税情况
  hasTax: '',
  taxArea: '',
  taxCompany: '',
  taxTotalMonths: '',
  taxCurrentMonths: '',
  taxBase: '',
  taxNote: '',
  taxCompanyType: '',
  taxCompanyName: '',

  // 企业信息
  companyName: '',
  companyAge: '',
  companyIncome: '',
  companyStaff: '',
  companyNote: ''
})

// 修改社保地区选择相关代码
const showSocialSecurityAreaPicker = ref(false)
const areaOptions = ref([
  { text: '北京', value: '北京' },
  { text: '上海', value: '上海' },
  { text: '广州', value: '广州' },
  { text: '深圳', value: '深圳' }
]) // 这里应该从后端获取

const onSocialSecurityAreaConfirm = (params: {
  selectedValues: string[],
  selectedOptions: Array<{ text: string; value: string }>,
  selectedIndexes: number[]
}) => {
  console.log(params)
  module2Data.socialSecurityArea = params.selectedOptions[0]?.text || ''
  showSocialSecurityAreaPicker.value = false
}

// 公积金地区选择相关代码
const showProvidentFundAreaPicker = ref(false)
const providentFundAreaOptions = ref([
  { text: '北京', value: '北京' },
  { text: '上海', value: '上海' },
  { text: '广州', value: '广州' },
  { text: '深圳', value: '深圳' }
]) // 这里应该从后端获取

const onProvidentFundAreaConfirm = (params: {
  selectedValues: string[],
  selectedOptions: Array<{ text: string; value: string }>,
  selectedIndexes: number[]
}) => {
  module2Data.providentFundArea = params.selectedOptions[0]?.text || ''
  showProvidentFundAreaPicker.value = false
}

// 个税地区选择相关代码
const showTaxAreaPicker = ref(false)
const taxAreaOptions = ref([
  { text: '北京', value: '北京' },
  { text: '上海', value: '上海' },
  { text: '广州', value: '广州' },
  { text: '深圳', value: '深圳' }
]) // 这里应该从后端获取

const onTaxAreaConfirm = (params: {
  selectedValues: string[],
  selectedOptions: Array<{ text: string; value: string }>,
  selectedIndexes: number[]
}) => {
  module2Data.taxArea = params.selectedOptions[0]?.text || ''
  showTaxAreaPicker.value = false
}

// module3Data 房产相关字段
const houseAreaOptions = [
  { text: '深圳', value: '深圳' }, { text: '广州', value: '广州' }, { text: '珠海', value: '珠海' }, { text: '汕头', value: '汕头' }, { text: '佛山', value: '佛山' }, { text: '韶关', value: '韶关' }, { text: '湛江', value: '湛江' }, { text: '肇庆', value: '肇庆' }, { text: '江门', value: '江门' }, { text: '茂名', value: '茂名' }, { text: '惠州', value: '惠州' }, { text: '梅州', value: '梅州' }, { text: '汕尾', value: '汕尾' }, { text: '河源', value: '河源' }, { text: '阳江', value: '阳江' }, { text: '清远', value: '清远' }, { text: '东莞', value: '东莞' }, { text: '中山', value: '中山' }, { text: '潮州', value: '潮州' }, { text: '揭阳', value: '揭阳' }, { text: '云浮', value: '云浮' }
]
// 使用 houseShareWithColumns 替代 houseShareOptions
const houseSecondTypeOptions = [
  { text: '银行', value: '银行' },
  { text: '小额', value: '小额' },
  { text: '私人', value: '私人' }
]

const module3Data = reactive({
  // 学历相关
  education: '',
  educationCheck: '',
  educationFullTime: '',
  // 房产相关
  hasHouse: '', // 是否有房产
  houseCount: '', // 房产套数
  houses: [] as any[], // 房产信息数组
})

watch(() => module3Data.houseCount, (val) => {
  const n = parseInt(val) || 0
  if (n > 0) {
    while (module3Data.houses.length < n) {
      module3Data.houses.push({
        area: '',
        areaPickerShow: false,
        type: '',
        ownMonths: '',
        size: '',
        shareType: '',
        sharePercent: '',
        shareWith: '',
        shareWithPickerShow: false,
        evalPrice: '',
        status: '',
        mortgageAmount: '',
        mortgageOrg: '',
        mortgageMonths: '',
        mortgageSecond: '',
        mortgageSecondAmount: '',
        mortgageSecondType: '',
        mortgageSecondTypePickerShow: false,
        mortgageSecondOrg: '',
        pledgeAmount: '',
        pledgeOrg: '',
        pledgeMonths: '',
        pledgeSecond: '',
        pledgeSecondAmount: '',
        pledgeSecondType: '',
        pledgeSecondTypePickerShow: false,
        pledgeSecondOrg: '',
      })
    }
    if (module3Data.houses.length > n) {
      module3Data.houses.splice(n)
    }
  } else {
    module3Data.houses = []
  }
})

// 车牌地区选项
const carPlateAreaOptions = [
  { text: '广州', value: '广州' }, { text: '深圳', value: '深圳' }, { text: '珠海', value: '珠海' }, { text: '汕头', value: '汕头' }, { text: '佛山', value: '佛山' }, { text: '韶关', value: '韶关' }, { text: '湛江', value: '湛江' }, { text: '肇庆', value: '肇庆' }, { text: '江门', value: '江门' }, { text: '茂名', value: '茂名' }, { text: '惠州', value: '惠州' }, { text: '梅州', value: '梅州' }, { text: '汕尾', value: '汕尾' }, { text: '河源', value: '河源' }, { text: '阳江', value: '阳江' }, { text: '清远', value: '清远' }, { text: '东莞', value: '东莞' }, { text: '中山', value: '中山' }, { text: '潮州', value: '潮州' }, { text: '揭阳', value: '揭阳' }, { text: '云浮', value: '云浮' }, { text: '湖南', value: '湖南' }, { text: '广西', value: '广西' }, { text: '海南', value: '海南' }, { text: '重庆', value: '重庆' }, { text: '四川', value: '四川' }, { text: '贵州', value: '贵州' }, { text: '云南', value: '云南' }, { text: '西藏', value: '西藏' }, { text: '陕西', value: '陕西' }, { text: '甘肃', value: '甘肃' }, { text: '青海', value: '青海' }, { text: '宁夏', value: '宁夏' }, { text: '新疆', value: '新疆' }, { text: '香港', value: '香港' }, { text: '澳门', value: '澳门' }, { text: '台湾', value: '台湾' }
]

// 车产相关数据
const module3CarData = reactive({
  hasCar: '', // 是否有车产
  carType: '', // 车辆类型
  carPlateArea: '', // 车牌地区
  carOwnMonths: '', // 名下月数
  carPlate: '', // 车牌
  carInvoice: '', // 发票金额（新车）
  carEval: '', // 评估金额（二手车）
  carMileage: '', // 公里数（二手车）
  carStatus: '', // 车产状态
  carMortgageAmount: '', // 按揭金额
  carMortgageMonths: '', // 按揭月供
  carMortgageOrg: '', // 按揭机构
  carPledgeAmount: '', // 抵押金额
  carPledgeMonths: '', // 抵押月供
  carPledgeOrg: '', // 抵押机构
})

// 车牌地区picker弹窗
const showCarPlateAreaPicker = ref(false)
const handleCarPlateAreaClick = () => {
  showCarPlateAreaPicker.value = true
}
const onCarPlateAreaConfirm = (val: any) => {
  module3CarData.carPlateArea = val.selectedOptions[0].text
  showCarPlateAreaPicker.value = false
}

// 房产共有人picker弹窗
const showHouseShareWithPicker = ref(false)
const currentHouseShareWithIndex = ref(-1)
const handleHouseShareWithClick = (idx: number) => {
  currentHouseShareWithIndex.value = idx
  showHouseShareWithPicker.value = true
}
const onHouseShareWithConfirm = (val: any) => {
  if (currentHouseShareWithIndex.value !== -1) {
    module3Data.houses[currentHouseShareWithIndex.value].shareWith = val.selectedOptions[0].text
  }
  showHouseShareWithPicker.value = false
}

// 模块4的数据
const module4Data = reactive({
  // 这里将添加具体的表单数据
  language: '',
  writing: '',
  physical: ''
})

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 临时保存各个模块
const saveModule1 = async () => {
  try {
    // TODO: 调用API保存模块1数据
    showSuccessToast('保存成功')
  } catch (error) {
    showFailToast('保存失败')
  }
}

// 提交所有模块
const submitAll = async () => {
  // 检查必填项
  const missingFields = validateRequiredFields()
  
  if (missingFields.length > 0) {
    // 有未填写的必填项
    showFailToast(`请填写必填项: ${missingFields.join(', ')}`)
    return
  }
  
  try {
    // 所有必填项已填写，打印JSON结果
    const formData = {
      module1Data,
      module2Data,
      module3Data,
      module3CarData,
      module3AssetData,
      module3FlowData,
      module4Data
    }
    
    console.log('Form data JSON:', JSON.stringify(formData, null, 2))
    // TODO: 调用API提交所有数据
    showSuccessToast('提交成功')
  } catch (error) {
    showFailToast('提交失败')
  }
}

// 验证必填项
const validateRequiredFields = () => {
  const missingFields = []
  
  // 模块 1 必填项验证
  // 检查近半年查询记录中的必填项
  module1Data.queryRecords.forEach((record, index) => {
    if (!record.loanType) {
      missingFields.push(`近半年查询记录${index + 1} - 申请贷款类型`)
    }
    if (!record.progress) {
      missingFields.push(`近半年查询记录${index + 1} - 后续进度`)
    }
    if (record.progress === '已拒' && !record.rejectReason) {
      missingFields.push(`近半年查询记录${index + 1} - 拒绝原因`)
    }
  })
  
  // 模块 2 必填项验证
  if (!module2Data.workType) {
    missingFields.push('工作类型')
  }
  if (!module2Data.canInvestigate) {
    missingFields.push('是否可考察')
  }
  if (!module2Data.hasSocialSecurity) {
    missingFields.push('是否有社保')
  }
  if (module2Data.hasSocialSecurity === '是' && !module2Data.socialSecurityPayer) {
    missingFields.push('社保缴费主体')
  }
  if (module2Data.socialSecurityPayer === '单位' && !module2Data.socialSecurityCompany) {
    missingFields.push('社保单位全称')
  }
  
  // 模块 3 必填项验证
  // 这里可以根据需要添加更多的验证
  
  return missingFields
}

// 公积金地区点击处理
const handleProvidentFundAreaClick = () => {
  if (module2Data.providentFundCompanyType !== '同社保单位') {
    showProvidentFundAreaPicker.value = true
  }
}

// 个税地区点击处理
const handleTaxAreaClick = () => {
  if (module2Data.taxCompanyType !== '同社保单位') {
    showTaxAreaPicker.value = true
  }
}

// 房产地区选择相关代码
const showHouseAreaPicker = ref(false)
const currentHouseAreaIndex = ref(-1)
const handleHouseAreaClick = (idx: number) => {
  currentHouseAreaIndex.value = idx
  showHouseAreaPicker.value = true
}
const onHouseAreaConfirm = (val: any) => {
  if (currentHouseAreaIndex.value !== -1) {
    module3Data.houses[currentHouseAreaIndex.value].area = val.selectedOptions[0].text
  }
  showHouseAreaPicker.value = false
}

// 房产二押机构类型选择相关代码
const showHouseSecondTypePickerVisible = ref(false)
const currentHouseForSecondType = ref<any>(null)

function showHouseSecondTypePicker(house: any) {
  currentHouseForSecondType.value = house
  showHouseSecondTypePickerVisible.value = true
}

function onHouseSecondTypeConfirm(val: any) {
  if (currentHouseForSecondType.value) {
    currentHouseForSecondType.value.mortgageSecondType = val.selectedOptions[0].text
    showHouseSecondTypePickerVisible.value = false
  }
}

// 金融资产类型选项
const assetTypeOptions = [
  { text: '股票', value: '股票' },
  { text: '基金', value: '基金' },
  { text: '理财', value: '理财' },
  { text: '定存', value: '定存' },
  { text: '保险', value: '保险' }
]

// 金融资产相关数据
const module3AssetData = reactive({
  hasAsset: '', // 是否有金融资产
  assetCount: '', // 金融资产份数
  assets: [] as any[], // 金融资产信息数组
})

watch(() => module3AssetData.assetCount, (val) => {
  let n = parseInt(val) || 0
  if (n > 4) n = 4
  if (n > 0) {
    while (module3AssetData.assets.length < n) {
      module3AssetData.assets.push({
        type: '',
        typePickerShow: false,
        months: '',
        amount: ''
      })
    }
    if (module3AssetData.assets.length > n) {
      module3AssetData.assets.splice(n)
    }
  } else {
    module3AssetData.assets = []
  }
})

// 金融资产类型picker弹窗
const showAssetTypePicker = ref(false)
const currentAssetIndex = ref(-1)
const handleAssetTypeClick = (idx: number) => {
  currentAssetIndex.value = idx
  showAssetTypePicker.value = true
}
const onAssetTypeConfirm = (val: any) => {
  if (currentAssetIndex.value !== -1) {
    module3AssetData.assets[currentAssetIndex.value].type = val.selectedOptions[0].text
  }
  showAssetTypePicker.value = false
}

// 与谁联名选项
const houseShareWithColumns = [
  { text: '父母', value: '父母' },
  { text: '子女', value: '子女' },
  { text: '配偶', value: '配偶' },
  { text: '兄弟姐妹', value: '兄弟姐妹' },
  { text: '朋友', value: '朋友' },
  { text: '多人', value: '多人' },
  { text: '其他', value: '其他' }
]

// 在 module3Data 中添加
const module3FlowData = reactive({
  hasFlow: '', // 是否有有效流水
  flowCount: '', // 流水份数
  flows: [] as any[], // 流水信息数组
})

watch(() => module3FlowData.flowCount, (val) => {
  let n = parseInt(val) || 0
  if (n > 2) n = 2 // 限制最多2份
  if (n > 0) {
    while (module3FlowData.flows.length < n) {
      module3FlowData.flows.push({
        type: '',
        features: [] as string[],
        salaryAmount: '', // 代发工资金额
        avgIncome6Months: '', // 近6个月月均进账
        avgIncome12Months: '', // 近12个月月均进账
        interest: ['', '', '', ''], // 近一年结息
      })
    }
    if (module3FlowData.flows.length > n) {
      module3FlowData.flows.splice(n)
    }
  } else {
    module3FlowData.flows = []
  }
})

// 格式化代发工资金额，保留两位小数
const formatSalaryAmount = (flow: any) => {
  if (flow.salaryAmount && flow.salaryAmount !== '') {
    const numVal = parseFloat(flow.salaryAmount)
    if (!isNaN(numVal)) {
      flow.salaryAmount = numVal.toFixed(2)
    }
  }
}

// 格式化月均进账，保留一位小数
const formatAvgIncome = (flow: any, field: 'avgIncome6Months' | 'avgIncome12Months') => {
  if (flow[field] && flow[field] !== '') {
    const numVal = parseFloat(flow[field])
    if (!isNaN(numVal)) {
      flow[field] = numVal.toFixed(1)
    }
  }
}

// 格式化结息，保留一位小数
const formatInterest = (flow: any, index: number) => {
  if (flow.interest[index] && flow.interest[index] !== '') {
    const numVal = parseFloat(flow.interest[index])
    if (!isNaN(numVal)) {
      flow.interest[index] = numVal.toFixed(1)
    }
  }
}
</script>

<style lang="less" scoped>
.last-examine {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f2f5 0%, #ffffff 100%);
}

.custom-nav {
  background: linear-gradient(90deg, #1976d2 0%, #2196f3 100%);
  
  :deep(.van-nav-bar__title) {
    color: #fff;
    font-size: 18px;
    font-weight: 500;
  }

  :deep(.van-icon) {
    color: #fff;
  }
}

.save-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  font-size: 14px;
  height: 32px;
  padding: 0 16px;
  border-radius: 16px;
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
}

.content {
  padding: 16px;
}

.module-group {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
}

.module-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  padding: 16px;
  background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #f0f0f0;
}

.module-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #1976d2;
}

.module-content {
  padding: 20px 16px;
  background: #fff;
}

.submit-section {
  margin-top: 32px;
  padding: 0 16px;
}

.submit-btn {
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 22px;
  background: linear-gradient(90deg, #1976d2 0%, #2196f3 100%);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  
  &:active {
    transform: scale(0.98);
  }
}

// 添加动画效果
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.module-group {
  animation: fadeIn 0.5s ease-out forwards;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
}

.section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 3px solid #1976d2;
}

.record-item, .loan-item {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:last-child {
    margin-bottom: 0;
  }
}

.record-header, .loan-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.record-date, .loan-date {
  margin-right: 12px;
  color: #1976d2;
  font-weight: 500;
}

.record-org, .loan-org {
  margin-right: 12px;
}

.loan-amount {
  margin-right: 12px;
  color: #f56c6c;
}

.loan-progress {
  color: #67c23a;
}

.radio-group, .checkbox-group {
  margin: 12px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.reject-reason, .blacklist-reason {
  margin-top: 12px;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}

:deep(.van-radio__label), :deep(.van-checkbox__label) {
  color: #333;
}

:deep(.van-field) {
  padding: 8px 0;
}

:deep(.van-field__label) {
  color: #666;
  width: 100%;
  margin-bottom: 8px;
  font-size: 14px;
}

:deep(.van-field__control) {
  color: #333;
  min-height: 36px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

:deep(.van-field__placeholder) {
  color: #999;
}

.radio-title {
  font-size: 14px;
  color: #666;
  margin: 12px 0 8px;
  font-weight: 500;
  position: relative;
}

.required .radio-title::before,
.required .checkbox-title::before {
  content: '*';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  color: #ee0a24;
}

.form-item {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}

.checkbox-title {
  font-size: 14px;
  color: #666;
  margin: 12px 0 8px;
  font-weight: 500;
}

// 添加弹出层样式
:deep(.van-popup) {
  border-radius: 16px 16px 0 0;
}

:deep(.van-picker) {
  .van-picker__toolbar {
    height: 44px;
    line-height: 44px;
  }
  
  .van-picker__title {
    font-size: 16px;
    font-weight: 500;
  }
  
  .van-picker__confirm {
    color: #1976d2;
  }
}

.flow-block {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:last-child {
    margin-bottom: 0;
  }
}

.interest-fields {
  .interest-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
  }

  .interest-inputs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
.required-field :deep(.van-field__label) {
  position: relative;
}

.required-field :deep(.van-field__label)::before {
  content: '';
}

.required-field :deep(.van-field__label)::after {
  content: '*';
  color: #ee0a24;
  margin-left: 4px;
}

/* 在标签前面添加红星 */
.required-field.star-before :deep(.van-field__label)::before {
  content: '*';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  color: #ee0a24;
}

.required-field.star-before :deep(.van-field__label)::after {
  content: '';
}
</style>